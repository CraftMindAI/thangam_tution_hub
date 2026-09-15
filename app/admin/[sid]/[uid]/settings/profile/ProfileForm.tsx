"use client";

import { useActionState, useState } from "react";
import { updateAdminProfile } from "@/app/actions/admin";
import { Pencil } from "@/app/components/icons";
import { AdminCard, AdminBadge, AdminButton } from "../../_components/ui";
import { SettingsTabs } from "../_components/SettingsTabs";

export default function ProfileForm({
  email,
  fullName,
  phone,
  role,
}: {
  email: string;
  fullName: string;
  phone: string;
  role: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateAdminProfile,
    undefined
  );

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state && "success" in state) setEditing(false);
  }

  function cancel() {
    setNameValue(fullName);
    setPhoneValue(phone);
    setEditing(false);
  }

  const initial = (fullName || "A").trim().charAt(0).toUpperCase();

  const fieldClass = (locked: boolean) =>
    `mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-xs font-semibold outline-none transition-colors ${
      locked
        ? "border-stone-200 bg-stone-100 text-stone-500 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-400 cursor-not-allowed"
        : "border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:border-yellow-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-yellow-400 dark:focus:bg-stone-900"
    }`;

  return (
    <div className="space-y-6">
      <SettingsTabs />

      <AdminCard className="p-6 sm:p-8">
        <form action={formAction}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800/80">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-stone-950 font-black text-2xl shadow-md shadow-yellow-500/20">
                {initial}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
                    {fullName || "Admin User"}
                  </h2>
                  <AdminBadge variant="yellow">{role.toUpperCase()}</AdminBadge>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {email}
                </p>
              </div>
            </div>

            {!editing && (
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                icon={Pencil}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </AdminButton>
            )}
          </div>

          {state && "error" in state && (
            <div className="mt-4 rounded-2xl bg-yellow-400/20 p-3.5 text-xs font-bold text-yellow-800 dark:text-yellow-300 border border-yellow-400/40">
              {state.error}
            </div>
          )}
          {state && "success" in state && !editing && (
            <div className="mt-4 rounded-2xl bg-emerald-500/15 p-3.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              Profile updated successfully.
            </div>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Full Name
                <input
                  name="full_name"
                  type="text"
                  required
                  minLength={2}
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  disabled={!editing}
                  className={fieldClass(!editing)}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Phone Number
                <input
                  name="phone"
                  type="tel"
                  required
                  pattern="[6-9][0-9]{9}"
                  maxLength={10}
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(e.target.value)}
                  disabled={!editing}
                  placeholder="10-digit mobile number"
                  className={fieldClass(!editing)}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Registered Email (Locked)
                <input
                  type="email"
                  value={email}
                  disabled
                  className={fieldClass(true)}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">
                Access Level
                <input
                  type="text"
                  value={role}
                  disabled
                  className={fieldClass(true)}
                />
              </label>
            </div>
          </div>

          {editing && (
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                onClick={cancel}
                disabled={pending}
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                size="sm"
                loading={pending}
              >
                Save Changes
              </AdminButton>
            </div>
          )}
        </form>
      </AdminCard>
    </div>
  );
}
