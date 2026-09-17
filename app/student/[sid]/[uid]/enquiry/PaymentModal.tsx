"use client";

import { useState } from "react";
import { createRazorpayOrder, verifyEnquiryPayment } from "@/app/actions/payments";
import { AdminButton } from "@/app/admin/_components/ui";
import { X } from "@/app/components/icons";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CHECKOUT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentModal({
  enquiryId,
  title,
  amount,
  chosenTime,
  onClose,
}: {
  enquiryId: string;
  title: string;
  amount: number;
  chosenTime: string;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "opening" | "verifying" | "paid">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function startPayment() {
    setError(null);
    setStatus("opening");

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      setError("Could not load the payment gateway. Check your connection.");
      setStatus("idle");
      return;
    }

    const order = await createRazorpayOrder(enquiryId);
    if ("error" in order) {
      setError(order.error);
      setStatus("idle");
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Thangam Varahi Tuition Hub",
      description: title,
      theme: { color: "#eab308" },
      modal: {
        ondismiss: () => setStatus("idle"),
      },
      handler: async (response: unknown) => {
        setStatus("verifying");
        const r = response as {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        };
        const result = await verifyEnquiryPayment({
          enquiryId,
          chosenTime,
          razorpayOrderId: r.razorpay_order_id,
          razorpayPaymentId: r.razorpay_payment_id,
          razorpaySignature: r.razorpay_signature,
        });
        if ("error" in result) {
          setError(result.error);
          setStatus("idle");
          return;
        }
        setStatus("paid");
      },
    });
    razorpay.open();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {status !== "paid" ? (
          <>
            <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100 dark:border-stone-800">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-sm">
                R
              </span>
              <div>
                <p className="text-sm font-extrabold text-stone-900 dark:text-white">
                  Razorpay Checkout
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Enquiry</span>
                <span className="font-bold text-stone-900 dark:text-white">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Class time</span>
                <span className="font-bold text-stone-900 dark:text-white">{chosenTime}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400">Amount payable</span>
                <span className="text-lg font-black text-stone-900 dark:text-white">
                  ₹{amount}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-500/10 p-3 text-xs font-bold text-red-600 dark:text-red-400 border border-red-500/20">
                {error}
              </div>
            )}

            <div className="mt-6">
              <AdminButton
                type="button"
                loading={status === "opening" || status === "verifying"}
                className="w-full"
                size="lg"
                onClick={startPayment}
              >
                {status === "verifying" ? "Verifying…" : `Pay ₹${amount}`}
              </AdminButton>
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-2xl font-black">
              ✓
            </div>
            <p className="mt-4 text-base font-extrabold text-stone-900 dark:text-white">
              Payment Successful
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              The admin will now schedule your class.
            </p>
            <AdminButton type="button" size="sm" className="mt-5" onClick={onClose}>
              Done
            </AdminButton>
          </div>
        )}
      </div>
    </div>
  );
}
