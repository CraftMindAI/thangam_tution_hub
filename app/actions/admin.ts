"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import * as z from "zod";
import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";

export type AdminSignInState = { error?: string } | undefined;

export async function adminSignIn(
  _state: AdminSignInState,
  formData: FormData
): Promise<AdminSignInState> {
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

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { error: "This account does not have admin access." };
  }

  redirect("/admin");
}

const phoneRegex = /^[6-9]\d{9}$/;

const inviteAdminSchema = z.object({
  full_name: z.string().trim().min(2, "Enter the admin's name"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

export type CreateAdminState =
  | { error: string }
  | { success: true; email: string }
  | undefined;

export async function createAdminUser(
  _state: CreateAdminState,
  formData: FormData
): Promise<CreateAdminState> {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { error: "You must be signed in as an admin to do this." };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (currentProfile?.role !== "admin") {
    return { error: "Only admins can create other admins." };
  }

  const parsed = inviteAdminSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const proto =
    headersList.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") ? "http" : "https");
  const redirectTo = `${proto}://${host}/admin/set-password`;

  const admin = createAdminClient();
  const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
    parsed.data.email,
    { redirectTo }
  );

  if (inviteErr) {
    return { error: inviteErr.message };
  }

  const { error: profileErr } = await admin.from("profiles").insert({
    id: invited.user.id,
    role: "admin",
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
  });

  if (profileErr) {
    return { error: profileErr.message };
  }

  return { success: true, email: parsed.data.email };
}

const setPasswordSchema = z
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

export type SetPasswordState = { error?: string } | undefined;

export async function setPassword(
  _state: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const parsed = setPasswordSchema.safeParse({
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
    return { error: "Your invite link has expired. Please ask for a new one." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}
