export const TASK_STATUSES = ["pending", "in_progress", "completed"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export type Task = {
  id: string;
  title: string;
  assigned_to: string;
  due_date: string | null;
  due_time: string | null;
  notes: string | null;
  status: TaskStatus;
  created_at: string;
};
