"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";
import { MAIL_FROM, sendNotificationEmail } from "../lib/mailer";
import {
  studentEnquirySchema,
  type StudentEnquiryFieldErrors,
} from "../lib/validation/enquiry";
import type { EnquiryStatus } from "../lib/enquiries";

export type SubmitEnquiryState =
  | { errors: StudentEnquiryFieldErrors; formError?: string }
  | { success: true }
  | undefined;

export async function submitStudentEnquiry(
  _state: SubmitEnquiryState,
  formData: FormData
): Promise<SubmitEnquiryState> {
  const parsed = studentEnquirySchema.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    duration_requested_minutes: formData.get("duration_requested_minutes"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { errors: {}, formError: "You must be signed in to submit an enquiry." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { error } = await supabase.from("student_enquiries").insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    return { errors: {}, formError: error.message };
  }

  if (MAIL_FROM) {
    await sendNotificationEmail(MAIL_FROM, `New Enquiry: ${parsed.data.title}`, [
      `${profile?.full_name ?? user.email ?? "A student"} submitted a new enquiry.`,
      `Title: ${parsed.data.title}`,
      `Subject: ${parsed.data.subject}`,
      `Requested duration: ${parsed.data.duration_requested_minutes} minutes`,
      "Review it from the admin Enquiry page.",
    ]);
  }

  revalidatePath("/student/[sid]/[uid]", "layout");
  return { success: true };
}

export type UpdateEnquiryState =
  | { errors: StudentEnquiryFieldErrors; formError?: string }
  | { success: true }
  | undefined;

/** Students can only edit their own enquiry while it's still awaiting review. */
export async function updateStudentEnquiry(
  _state: UpdateEnquiryState,
  formData: FormData
): Promise<UpdateEnquiryState> {
  const enquiryId = formData.get("enquiry_id");
  if (typeof enquiryId !== "string" || !enquiryId) {
    return { errors: {}, formError: "Missing enquiry." };
  }

  const parsed = studentEnquirySchema.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    duration_requested_minutes: formData.get("duration_requested_minutes"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { errors: {}, formError: "You must be signed in." };
  }

  const { data: enquiry } = await supabase
    .from("student_enquiries")
    .select("id, status")
    .eq("id", enquiryId)
    .eq("user_id", user.id)
    .single();

  if (!enquiry) {
    return { errors: {}, formError: "Enquiry not found." };
  }
  if ((enquiry.status as EnquiryStatus) !== "requested") {
    return { errors: {}, formError: "This enquiry has already been reviewed and can no longer be edited." };
  }

  const { error } = await supabase
    .from("student_enquiries")
    .update(parsed.data)
    .eq("id", enquiryId)
    .eq("user_id", user.id);

  if (error) {
    return { errors: {}, formError: error.message };
  }

  revalidatePath("/student/[sid]/[uid]", "layout");
  return { success: true };
}

/** Students can only delete their own enquiry while it's still awaiting review. */
export async function deleteStudentEnquiry(formData: FormData): Promise<void> {
  const enquiryId = formData.get("enquiry_id");
  if (typeof enquiryId !== "string" || !enquiryId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: enquiry } = await supabase
    .from("student_enquiries")
    .select("id, status")
    .eq("id", enquiryId)
    .eq("user_id", user.id)
    .single();

  if (!enquiry || (enquiry.status as EnquiryStatus) !== "requested") return;

  await supabase
    .from("student_enquiries")
    .delete()
    .eq("id", enquiryId)
    .eq("user_id", user.id);

  revalidatePath("/student/[sid]/[uid]", "layout");
}
