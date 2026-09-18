-- Track which student email a task was sent to, and whether that email
-- delivery succeeded — separate from `status`, which tracks the student's
-- own progress on the task (pending / in_progress / completed).
alter table public.tasks add column if not exists notified_email text;
alter table public.tasks add column if not exists email_status text
  not null default 'pending' check (email_status in ('pending', 'sent', 'failed'));
