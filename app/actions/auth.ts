"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import * as z from "zod";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import { buildAdminPath, buildStudentDashboardPath } from "../lib/secure-path";

export type SignInState = { error?: string } | undefined;

export async function signIn(
  _state: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return { error: "Please enter both email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  redirect(
    profile?.role === "admin"
      ? buildAdminPath(data.user.id)
      : buildStudentDashboardPath(data.user.id)
  );
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/signin");
}

export type RequestPasswordResetState =
  | { error?: string; success?: boolean; message?: string }
  | undefined;

export async function requestPasswordReset(
  _state: RequestPasswordResetState,
  formData: FormData
): Promise<RequestPasswordResetState> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email) {
    return { error: "Please enter your email address." };
  }

  const admin = createAdminClient();
  const { data: userList, error: lookupError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (lookupError) {
    return { error: "Something went wrong. Please try again." };
  }

  const userExists = userList.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );

  if (!userExists) {
    return { error: "No account found with that email address." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const proto =
    headersList.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${proto}://${host}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "A reset link has been sent to your email.",
  };
}

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain a letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormState = { error?: string } | undefined;

export async function resetPassword(
  _state: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Your reset link has expired. Please request a new one." };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: error.message };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(
    profile?.role === "admin"
      ? buildAdminPath(user.id)
      : buildStudentDashboardPath(user.id)
  );
}
