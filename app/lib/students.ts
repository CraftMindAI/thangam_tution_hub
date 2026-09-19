export const STUDENT_CLASSES = [
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
] as const;

export type StudentClass = (typeof STUDENT_CLASSES)[number];

export const STUDENT_TYPES = ["new_student", "existing_student"] as const;

/**
 * Students who signed themselves up on the site are "New Student"; students
 * the admin entered on the roster are "Existing Student".
 */
export type StudentType = (typeof STUDENT_TYPES)[number];

export const STUDENT_TYPE_LABELS: Record<StudentType, string> = {
  new_student: "New Student",
  existing_student: "Existing Student",
};

/**
 * Coerce a raw class value (from a form or a spreadsheet cell) to one of
 * STUDENT_CLASSES, or "" when it doesn't match.
 * Accepts "lkg", "UKG", "1", "Class 5", "grade 10", "10th", etc.
 */
export function normalizeClass(raw: string): string {
  const v = String(raw).trim().toUpperCase();
  if (v === "LKG" || v === "UKG") return v;
  const m = v.match(/\d{1,2}/);
  if (m) {
    const n = Number(m[0]);
    if (n >= 1 && n <= 10) return String(n);
  }
  return "";
}
