import * as z from "zod";
import {
  ENQUIRY_MIN_DURATION_MINUTES,
  ENQUIRY_MAX_DURATION_MINUTES,
} from "../enquiries";

export const studentEnquirySchema = z.object({
  title: z.string().trim().min(2, "Enter a title (e.g. the unit name)"),
  subject: z.string().trim().min(1, "Enter the subject"),
  description: z.string().trim().min(1, "Enter a description"),
  duration_requested_minutes: z.coerce
    .number()
    .int()
    .min(ENQUIRY_MIN_DURATION_MINUTES, "Minimum duration is 40 minutes")
    .max(ENQUIRY_MAX_DURATION_MINUTES, "Maximum duration is 1 hour 30 minutes"),
});

export type StudentEnquiryInput = z.infer<typeof studentEnquirySchema>;
export type StudentEnquiryFieldErrors = z.inferFlattenedErrors<
  typeof studentEnquirySchema
>["fieldErrors"];
