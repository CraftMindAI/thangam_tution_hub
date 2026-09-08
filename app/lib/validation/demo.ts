import * as z from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const demoRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  description: z.string().trim().min(10, "Please add a few more details (at least 10 characters)"),
});

export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
export type DemoRequestFieldErrors = z.inferFlattenedErrors<
  typeof demoRequestSchema
>["fieldErrors"];
