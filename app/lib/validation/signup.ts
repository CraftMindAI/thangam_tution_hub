import * as z from "zod";

const phoneRegex = /^[6-9]\d{9}$/;
const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

function isTodayOrFuture(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

const account = {
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
};

const feedbackRating = z
  .union([z.literal(""), z.enum(["not_satisfied", "somewhat_good", "excellent"])])
  .optional()
  .transform((v) => (v ? v : undefined));

export const existingStudentSchema = z.object({
  role: z.literal("existing_student"),
  ...account,
  student_name: z.string().trim().min(2, "Enter the student's name"),
  parent_name: z.string().trim().min(2, "Enter the parent's name"),
  parent_contact: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  standard: z.string().trim().min(1, "Enter the standard of studying"),
  subject: z.string().trim().min(1, "Enter the subject"),
  chapter_unit: z.string().trim().min(1, "Enter the chapter / unit"),
  expected_class_date: z
    .string()
    .min(1, "Choose a date")
    .refine(isTodayOrFuture, "Choose today or a future date"),
  expected_class_time: z
    .string()
    .regex(timeRegex, "Choose a valid time"),
  feedback_rating: feedbackRating,
});

export const newStudentSchema = z.object({
  role: z.literal("new_student"),
  ...account,
  contact_person_name: z.string().trim().min(2, "Enter the contacted person's name"),
  relationship_with_student: z
    .string()
    .trim()
    .min(2, "Enter the relationship with the student"),
  new_student_name: z.string().trim().min(2, "Enter the student's name"),
  new_standard: z.string().trim().min(1, "Enter the standard of studying"),
  followup_contact_name: z
    .string()
    .trim()
    .min(2, "Enter a contact person name"),
  followup_contact_number: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid 10-digit mobile number"),
  meeting_date: z
    .string()
    .min(1, "Choose a date")
    .refine(isTodayOrFuture, "Choose today or a future date"),
  meeting_time: z.string().regex(timeRegex, "Choose a valid time"),
});

export const signUpSchema = z.discriminatedUnion("role", [
  existingStudentSchema,
  newStudentSchema,
]);

export type SignUpInput = z.infer<typeof signUpSchema>;

type AllFieldNames =
  | keyof z.infer<typeof existingStudentSchema>
  | keyof z.infer<typeof newStudentSchema>;

export type SignUpFieldErrors = Partial<Record<AllFieldNames, string[]>>;
