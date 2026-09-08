import * as z from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const signUpSchema = z
  .object({
    student_name: z.string().trim().min(2, "Enter the student's name"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain a letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    standard: z.string().trim().min(1, "Enter the class / standard"),
    school_name: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined)),
    parent_name: z.string().trim().min(2, "Enter the parent's name"),
    parent_phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignUpFieldErrors = z.inferFlattenedErrors<typeof signUpSchema>["fieldErrors"];
