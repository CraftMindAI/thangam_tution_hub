"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";
import {
  studentEnquirySchema,
  type StudentEnquiryFieldErrors,
} from "../lib/validation/enquiry";

export type SubmitEnquiryState =
  | { errors: StudentEnquiryFieldErrors; formError?: string }
  | { success: true }
  | undefined;

export async function submitStudentEnquiry(
  _state: SubmitEnquiryState,
  formData: FormData
): Promise<SubmitEnquiryState> {
  const parsed = studentEnquirySchema.safeParse({
    title: formData.get("title"),
    subject: formData.get("subject"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { errors: {}, formError: "You must be signed in to submit an enquiry." };
  }

  const { error } = await supabase.from("student_enquiries").insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    return { errors: {}, formError: error.message };
  }

  revalidatePath("/student/enquiry");
  return { success: true };
}
