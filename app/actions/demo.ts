"use server";

import { createClient } from "../lib/supabase/server";
import {
  demoRequestSchema,
  type DemoRequestFieldErrors,
} from "../lib/validation/demo";

export type DemoRequestState =
  | { errors: DemoRequestFieldErrors; formError?: string }
  | { success: true }
  | undefined;

export async function submitDemoRequest(
  _state: DemoRequestState,
  formData: FormData
): Promise<DemoRequestState> {
  const parsed = demoRequestSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("demo_requests").insert(parsed.data);

  if (error) {
    return { errors: {}, formError: error.message };
  }

  return { success: true };
}
