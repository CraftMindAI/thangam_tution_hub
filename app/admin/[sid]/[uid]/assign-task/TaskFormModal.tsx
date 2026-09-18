"use client";

import { useState } from "react";
import TaskForm, { type StudentOption } from "./TaskForm";
import { X, Plus } from "@/app/components/icons";
import { AdminButton } from "../_components/ui";

export default function TaskFormModal({ students }: { students: StudentOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdminButton onClick={() => setOpen(true)} size="sm" icon={Plus}>
        Add Task
      </AdminButton>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div className="relative mx-auto my-6 w-full max-w-3xl px-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
                className="absolute right-4 top-4 z-20 rounded-xl p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <TaskForm students={students} onDone={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
