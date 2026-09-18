export const TASK_STATUSES = ["pending", "in_progress", "completed"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export const SEND_TO_OPTIONS = ["all", "selected"] as const;

export type TaskSendTo = (typeof SEND_TO_OPTIONS)[number];

export const TASK_SEND_TO_LABELS: Record<TaskSendTo, string> = {
  all: "All students",
  selected: "Particular students",
};

export const EMAIL_STATUSES = ["pending", "sent", "failed"] as const;

export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  pending: "Pending",
  sent: "Sent",
  failed: "Failed",
};

export type Task = {
  id: string;
  title: string;
  assigned_to: string;
  due_date: string | null;
  due_time: string | null;
  notes: string | null;
  status: TaskStatus;
  notified_email: string | null;
  email_status: EmailStatus;
  submitted_at: string | null;
  updated_at: string;
  created_at: string;
};

/**
 * The task email goes out over plain SMTP, not the Gmail API, so there's no
 * message id to deep-link to. The closest we can do is open Gmail's own
 * search for the exact subject line it was sent with (see notifyStudents()
 * in app/actions/tasks.ts) — optionally narrowed to a specific recipient,
 * for an admin viewing a task they sent to a particular student.
 *
 * Opens in whichever Gmail account is signed in in the viewer's browser —
 * the student's own inbox, or an admin's, depending on who clicks it.
 */
export function gmailTaskSearchUrl(taskTitle: string, recipientEmail?: string) {
  const query = [
    recipientEmail ? `to:${recipientEmail}` : null,
    `subject:"Task assigned: ${taskTitle}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`;
}
