"use client";

import { useState } from "react";
import EventForm, { type EnquiryOption } from "./EventForm";
import { X } from "@/app/components/icons";

export default function AddEventModal({
  defaultDate,
  defaultTime = "09:00",
  enquiryStudents,
}: {
  defaultDate: string;
  defaultTime?: string;
  enquiryStudents: EnquiryOption[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-stone-900/20 transition-transform hover:scale-[1.02]"
      >
        + Add Event
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-auto my-8 w-full max-w-lg px-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-700 dark:hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
              <EventForm
                mode="create"
                defaultDate={defaultDate}
                defaultTime={defaultTime}
                enquiryStudents={enquiryStudents}
                onDone={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
