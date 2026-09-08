import * as z from "zod";

export const studentEnquirySchema = z.object({
  title: z.string().trim().min(2, "Enter a title (e.g. the unit name)"),
  subject: z.string().trim().min(1, "Enter the subject"),
  description: z.string().trim().min(1, "Enter a description"),
});

export type StudentEnquiryInput = z.infer<typeof studentEnquirySchema>;
export type StudentEnquiryFieldErrors = z.inferFlattenedErrors<
  typeof studentEnquirySchema
>["fieldErrors"];
