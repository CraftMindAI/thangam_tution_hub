"use server";

import { createHmac } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";
import { MAIL_FROM, sendNotificationEmail } from "../lib/mailer";
import type { EnquiryStatus } from "../lib/enquiries";

const RAZORPAY_API = "https://api.razorpay.com/v1";

function razorpayAuthHeader(): string | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export type CreateOrderResult =
  | { error: string }
  | { success: true; orderId: string; amount: number; currency: string; keyId: string };

/**
 * Creates a Razorpay order for the given enquiry's payment amount. The
 * student must own the enquiry and it must be awaiting payment.
 */
export async function createRazorpayOrder(
  enquiryId: string
): Promise<CreateOrderResult> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const auth = razorpayAuthHeader();
  if (!keyId || !auth) {
    return { error: "Payments are not configured. Contact the admin." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: enquiry } = await supabase
    .from("student_enquiries")
    .select("id, title, status, payment_amount")
    .eq("id", enquiryId)
    .eq("user_id", user.id)
    .single();

  if (!enquiry) return { error: "Enquiry not found." };
  if ((enquiry.status as EnquiryStatus) !== "reviewed") {
    return { error: "This enquiry isn't awaiting payment." };
  }
  if (!enquiry.payment_amount || enquiry.payment_amount <= 0) {
    return { error: "No payment amount has been set for this enquiry." };
  }

  const amountPaise = Math.round(enquiry.payment_amount * 100);

  try {
    const res = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        amount: amountPaise,
        currency: "INR",
        receipt: enquiry.id,
        notes: { enquiry_id: enquiry.id, title: enquiry.title },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data?.error?.description ?? "Could not start payment." };
    }
    return {
      success: true,
      orderId: data.id,
      amount: amountPaise,
      currency: data.currency,
      keyId,
    };
  } catch (err) {
    console.error("Razorpay order creation failed", err);
    return { error: "Could not reach the payment gateway. Try again." };
  }
}

/**
 * Razorpay's checkout success callback only returns IDs + signature — the
 * contact number the student paid with lives on the Payment object itself.
 */
async function fetchRazorpayPaymentContact(paymentId: string): Promise<string | null> {
  const auth = razorpayAuthHeader();
  if (!auth) return null;

  try {
    const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}`, {
      headers: { Authorization: auth },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.contact === "string" ? data.contact : null;
  } catch (err) {
    console.error("Failed to fetch Razorpay payment details", err);
    return null;
  }
}

export type VerifyPaymentResult = { error: string } | { success: true };

/**
 * Verifies Razorpay's HMAC signature server-side (never trust the client's
 * "it succeeded" callback alone), then marks the enquiry paid with the
 * student's chosen class time.
 */
export async function verifyEnquiryPayment(input: {
  enquiryId: string;
  chosenTime: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<VerifyPaymentResult> {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return { error: "Payments are not configured. Contact the admin." };
  }

  const expected = createHmac("sha256", keySecret)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");
  if (expected !== input.razorpaySignature) {
    return { error: "Payment could not be verified." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const { data: enquiry } = await supabase
    .from("student_enquiries")
    .select("id, title, user_id, status, suggested_times, payment_amount")
    .eq("id", input.enquiryId)
    .eq("user_id", user.id)
    .single();

  if (!enquiry) return { error: "Enquiry not found." };
  if ((enquiry.status as EnquiryStatus) !== "reviewed") {
    return { error: "This enquiry isn't awaiting payment." };
  }
  const suggested = (enquiry.suggested_times as string[] | null) ?? [];
  if (!suggested.includes(input.chosenTime)) {
    return { error: "Choose one of the suggested times." };
  }

  const { error } = await supabase
    .from("student_enquiries")
    .update({
      chosen_time: input.chosenTime,
      status: "paid",
      paid_at: new Date().toISOString(),
    })
    .eq("id", input.enquiryId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  const contact = await fetchRazorpayPaymentContact(input.razorpayPaymentId);
  const { error: paymentErr } = await supabase.from("payments").insert({
    user_id: user.id,
    enquiry_id: input.enquiryId,
    amount: enquiry.payment_amount ?? 0,
    contact,
    razorpay_order_id: input.razorpayOrderId,
    razorpay_payment_id: input.razorpayPaymentId,
  });
  if (paymentErr) {
    console.error("Failed to record payment receipt", paymentErr);
  }

  if (MAIL_FROM) {
    await sendNotificationEmail(MAIL_FROM, `Payment received: ${enquiry.title}`, [
      `The student has approved and paid for "${enquiry.title}".`,
      `Amount: ₹${enquiry.payment_amount ?? "—"}`,
      `Chosen time: ${input.chosenTime}`,
      `Razorpay payment ID: ${input.razorpayPaymentId}`,
      "Schedule the class from the admin Enquiry page.",
    ]);
  }

  revalidatePath("/student/[sid]/[uid]", "layout");
  revalidatePath("/admin/[sid]/[uid]", "layout");
  return { success: true };
}
