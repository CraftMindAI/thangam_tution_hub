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
