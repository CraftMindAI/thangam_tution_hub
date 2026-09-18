-- Track when a task's status last changed, so a task completed via the
-- manual status dropdown (no submission timestamp) still has a date to show.
alter table public.tasks add column if not exists updated_at timestamptz not null default now();
