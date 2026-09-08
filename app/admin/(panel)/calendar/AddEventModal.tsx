"use client";

import { useState } from "react";
import EventForm from "./EventForm";
import { X } from "../../../components/icons";

export default function AddEventModal({
  defaultDate,
  defaultTime = "09:00",
}: {
  defaultDate: string;
  defaultTime?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full bg-gradient-to-r from-slate-700 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition-transform hover:scale-[1.02]"
      >
        + Add Event
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-auto my-8 w-full max-w-lg px-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-stone-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
              <EventForm
                mode="create"
                defaultDate={defaultDate}
                defaultTime={defaultTime}
                onDone={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
