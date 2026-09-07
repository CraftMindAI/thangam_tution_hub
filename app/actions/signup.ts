"use server";

import { createClient } from "../lib/supabase/server";
import { createAdminClient } from "../lib/supabase/admin";
import {
  signUpSchema,
  type SignUpFieldErrors,
} from "../lib/validation/signup";

export type SignUpState =
  | { errors: SignUpFieldErrors; formError?: string }
  | { success: true; needsConfirmation: boolean }
  | undefined;

function str(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function signUp(
  _state: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const role = str(formData, "role");
  if (role !== "existing_student" && role !== "new_student") {
    return {
      errors: {},
      formError: "Please choose whether you're an existing or new student.",
    };
  }

  const raw = {
    role,
    email: str(formData, "email"),
    password: str(formData, "password"),
    student_name: str(formData, "student_name"),
    parent_name: str(formData, "parent_name"),
    parent_contact: str(formData, "parent_contact"),
    standard: str(formData, "standard"),
    subject: str(formData, "subject"),
    chapter_unit: str(formData, "chapter_unit"),
    expected_class_date: str(formData, "expected_class_date"),
    expected_class_time: str(formData, "expected_class_time"),
    feedback_rating: str(formData, "feedback_rating"),
    contact_person_name: str(formData, "contact_person_name"),
    relationship_with_student: str(formData, "relationship_with_student"),
    new_student_name: str(formData, "new_student_name"),
    new_standard: str(formData, "new_standard"),
    followup_contact_name: str(formData, "followup_contact_name"),
    followup_contact_number: str(formData, "followup_contact_number"),
    meeting_date: str(formData, "meeting_date"),
    meeting_time: str(formData, "meeting_time"),
  };

  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as SignUpFieldErrors,
    };
  }
  const input = parsed.data;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { role: input.role } },
  });

  if (error) {
    return { errors: {}, formError: error.message };
  }

  const userId = data.user?.id;
  if (!userId) {
    return {
      errors: {},
      formError: "Something went wrong creating your account.",
    };
  }

  const admin = createAdminClient();

  const { error: profileError } = await admin
    .from("profiles")
    .insert({ id: userId, role: input.role });
  if (profileError) {
    return { errors: {}, formError: profileError.message };
  }

  if (input.role === "existing_student") {
    const { error: reqError } = await admin
      .from("existing_student_requests")
      .insert({
        user_id: userId,
        student_name: input.student_name,
        parent_name: input.parent_name,
        parent_contact: input.parent_contact,
        standard: input.standard,
        subject: input.subject,
        chapter_unit: input.chapter_unit,
        expected_class_date: input.expected_class_date,
        expected_class_time: input.expected_class_time,
        feedback_rating: input.feedback_rating ?? null,
      });
    if (reqError) {
      return { errors: {}, formError: reqError.message };
    }
  } else {
    const { error: reqError } = await admin
      .from("new_student_requests")
      .insert({
        user_id: userId,
        contact_person_name: input.contact_person_name,
        relationship_with_student: input.relationship_with_student,
        student_name: input.new_student_name,
        standard: input.new_standard,
        followup_contact_name: input.followup_contact_name,
        followup_contact_number: input.followup_contact_number,
        meeting_at: new Date(
          `${input.meeting_date}T${input.meeting_time}`
        ).toISOString(),
      });
    if (reqError) {
      return { errors: {}, formError: reqError.message };
    }
  }

  return { success: true, needsConfirmation: !data.session };
}
