"use client";

import { useState } from "react";
import EventForm, { type EnquiryOption, type StudentOption } from "./EventForm";
import { X, Plus } from "@/app/components/icons";
import { AdminButton } from "../_components/ui";

export default function AddEventModal({
  defaultDate,
  defaultTime = "09:00",
  enquiryStudents,
  allStudents,
}: {
  defaultDate: string;
  defaultTime?: string;
  enquiryStudents: EnquiryOption[];
  allStudents: StudentOption[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdminButton
        onClick={() => setOpen(true)}
        size="sm"
        icon={Plus}
      >
        Add Event
      </AdminButton>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-auto my-8 w-full max-w-2xl px-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
                className="absolute right-4 top-4 z-20 rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <EventForm
                mode="create"
                defaultDate={defaultDate}
                defaultTime={defaultTime}
                enquiryStudents={enquiryStudents}
                allStudents={allStudents}
                onDone={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
