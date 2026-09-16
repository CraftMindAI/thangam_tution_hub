"use client";

import { useActionState, useState } from "react";
import { updateStudentProfile } from "@/app/actions/students";
import { Pencil, GraduationCap, HeartHandshake } from "@/app/components/icons";
import { AdminCard, AdminBadge, AdminButton } from "@/app/admin/_components/ui";
import { STUDENT_TYPE_LABELS, STUDENT_CLASSES, type StudentType } from "@/app/lib/students";

export default function ProfileForm({
  email,
  fullName,
  phone,
  role,
  studentClass,
  school,
  location,
  parentName,
  parentPhone,
  parentEmail,
}: {
  email: string;
  fullName: string;
  phone: string;
  role: string;
  studentClass: string;
  school: string;
  location: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateStudentProfile,
    undefined
  );

  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(fullName);
  const [phoneValue, setPhoneValue] = useState(phone);
  const [classValue, setClassValue] = useState(studentClass);
  const [schoolValue, setSchoolValue] = useState(school);
  const [locationValue, setLocationValue] = useState(location);
  const [parentNameValue, setParentNameValue] = useState(parentName);
  const [parentPhoneValue, setParentPhoneValue] = useState(parentPhone);
  const [parentEmailValue, setParentEmailValue] = useState(parentEmail);

  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state && "success" in state) setEditing(false);
  }

  function cancel() {
    setNameValue(fullName);
    setPhoneValue(phone);
    setClassValue(studentClass);
    setSchoolValue(school);
    setLocationValue(location);
    setParentNameValue(parentName);
    setParentPhoneValue(parentPhone);
    setParentEmailValue(parentEmail);
    setEditing(false);
  }

  const initial = (fullName || "S").trim().charAt(0).toUpperCase();
  const roleLabel =
    STUDENT_TYPE_LABELS[role as StudentType] ?? "Student";

  const fieldClass = (locked: boolean) =>
    `mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-xs font-semibold outline-none transition-colors ${
      locked
        ? "border-stone-200 bg-stone-100 text-stone-500 dark:border-stone-800 dark:bg-stone-900/60 dark:text-stone-400 cursor-not-allowed"
        : "border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white dark:border-stone-800 dark:bg-stone-900 dark:text-white dark:focus:border-stone-400 dark:focus:bg-stone-900"
    }`;

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-stone-800 text-white font-black text-2xl shadow-md shadow-stone-900/20">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
                  {fullName || "Student"}
                </h2>
                <AdminBadge variant="gray">{roleLabel}</AdminBadge>
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
              Account Type
              <input
                type="text"
                value={roleLabel}
                disabled
                className={fieldClass(true)}
              />
            </label>
          </div>
        </div>
      </AdminCard>

      <AdminCard className="p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-6 border-b border-stone-100 dark:border-stone-800/80">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <GraduationCap className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-white">
              School Details
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Tap Edit Profile above to make changes.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              School Name
              <input
                name="school"
                type="text"
                required
                value={schoolValue}
                onChange={(e) => setSchoolValue(e.target.value)}
                disabled={!editing}
                placeholder="Your school's name"
                className={fieldClass(!editing)}
              />
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Class
              <select
                name="class"
                required
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
                disabled={!editing}
                className={fieldClass(!editing)}
              >
                <option value="" disabled>
                  Select class
                </option>
                {STUDENT_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Location
              <input
                name="location"
                type="text"
                required
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                disabled={!editing}
                placeholder="Area / city"
                className={fieldClass(!editing)}
              />
            </label>
          </div>
        </div>
      </AdminCard>

      <AdminCard className="p-6 sm:p-8">
        <div className="flex items-center gap-3 pb-6 border-b border-stone-100 dark:border-stone-800/80">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <HeartHandshake className="h-6 w-6" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-stone-900 dark:text-white">
              Parent Details
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Tap Edit Profile above to make changes.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Parent&apos;s Name
              <input
                name="parent_name"
                type="text"
                value={parentNameValue}
                onChange={(e) => setParentNameValue(e.target.value)}
                disabled={!editing}
                placeholder="Parent / guardian name"
                className={fieldClass(!editing)}
              />
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Parent&apos;s Phone Number
              <input
                name="parent_phone"
                type="tel"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                value={parentPhoneValue}
                onChange={(e) => setParentPhoneValue(e.target.value)}
                disabled={!editing}
                placeholder="10-digit mobile number"
                className={fieldClass(!editing)}
              />
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Parent&apos;s Email
              <input
                name="parent_email"
                type="email"
                value={parentEmailValue}
                onChange={(e) => setParentEmailValue(e.target.value)}
                disabled={!editing}
                placeholder="parent@example.com"
                className={fieldClass(!editing)}
              />
            </label>
          </div>
        </div>
      </AdminCard>

      {editing && (
        <div className="flex justify-end gap-3">
          <AdminButton
            type="button"
            variant="outline"
            size="sm"
            onClick={cancel}
            disabled={pending}
          >
            Cancel
          </AdminButton>
          <AdminButton type="submit" size="sm" loading={pending}>
            Save Changes
          </AdminButton>
        </div>
      )}
    </form>
  );
}
