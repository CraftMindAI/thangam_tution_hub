"use server";

import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { signUpSchema, type SignUpFieldErrors } from "../lib/validation/signup";
import { buildStudentDashboardPath } from "../lib/secure-path";

export type SignUpState =
  | { errors: SignUpFieldErrors; formError?: string }
  | { success: true; needsConfirmation: boolean }
  | undefined;

export async function signUp(
  _state: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const parsed = signUpSchema.safeParse({
    student_name: formData.get("student_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    standard: formData.get("standard"),
    school_name: formData.get("school_name"),
    parent_name: formData.get("parent_name"),
    parent_phone: formData.get("parent_phone"),
    location: formData.get("location"),
    parent_email: formData.get("parent_email"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const input = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { errors: {}, formError: error.message };
  }

  // Supabase returns a decoy user with no error when the email already
  // exists (to avoid leaking which emails are registered) — it can be
  // told apart by an empty `identities` array.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      errors: {},
      formError: "This email is already registered. Please sign in instead.",
    };
  }

  const userId = data.user?.id;
  if (!userId) {
    return { errors: {}, formError: "Something went wrong creating your account." };
  }

  // Every self-signup is a new student by definition — existing students
  // already have accounts created for them.
  const admin = createAdminClient();

  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    role: "new_student",
    full_name: input.student_name,
    class: input.standard,
    school: input.school_name ?? null,
    location: input.location,
    parent_name: input.parent_name,
    parent_phone: input.parent_phone,
    parent_email: input.parent_email ?? null,
  });
  if (profileError) {
    return { errors: {}, formError: profileError.message };
  }

  const { error: requestError } = await admin.from("new_student_requests").insert({
    user_id: userId,
    student_name: input.student_name,
    standard: input.standard,
    school_name: input.school_name ?? null,
    parent_name: input.parent_name,
    parent_phone: input.parent_phone,
  });
  if (requestError) {
    return { errors: {}, formError: requestError.message };
  }

  if (data.session) {
    redirect(buildStudentDashboardPath(userId));
  }

  return { success: true, needsConfirmation: true };
}
