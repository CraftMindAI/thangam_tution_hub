"use client";

import { useActionState, useRef, useState } from "react";
import { submitTaskDocument } from "@/app/actions/tasks";
import { CheckCircle, X } from "@/app/components/icons";
import { AdminButton } from "@/app/admin/_components/ui";

export default function TaskSubmitForm({ taskId }: { taskId: string }) {
  const [state, formAction, pending] = useActionState(submitTaskDocument, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Pop the modal open the render after a new result arrives, without a
  // setState-in-effect — mirrors the "remount on success" pattern in TaskForm.
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(state);
  if (state !== seen) {
    setSeen(state);
    if (state) setOpen(true);
  }

  const isError = state && "error" in state;

  return (
    <>
      <form
        ref={formRef}
        action={(fd) => {
          formAction(fd);
          formRef.current?.reset();
        }}
        className="flex items-center justify-end gap-1.5"
      >
        <input type="hidden" name="id" value={taskId} />
        <input
          name="document"
          type="file"
          accept="application/pdf"
          required
          className="w-40 text-[11px] text-stone-500 file:mr-2 file:rounded-lg file:border-0 file:bg-yellow-400 file:px-2 file:py-1 file:text-[11px] file:font-bold file:text-stone-950 hover:file:bg-yellow-300 dark:text-stone-400 cursor-pointer"
        />
        <AdminButton type="submit" size="sm" loading={pending}>
          Submit
        </AdminButton>
      </form>

      {open && state && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-2xl dark:border-stone-800 dark:bg-[#14151b]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <span
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
                isError
                  ? "bg-red-500/15 text-red-600 dark:text-red-400"
                  : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {isError ? <X className="h-6 w-6" /> : <CheckCircle className="h-6 w-6" />}
            </span>

            <p className="mt-3 text-sm font-bold text-stone-900 dark:text-white">
              {isError ? "Submission failed" : "Task submitted"}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {isError ? state.error : "message" in state ? state.message : ""}
            </p>

            <AdminButton
              type="button"
              size="sm"
              className="mt-4 w-full justify-center"
              onClick={() => setOpen(false)}
            >
              OK
            </AdminButton>
          </div>
        </div>
      )}
    </>
  );
}
