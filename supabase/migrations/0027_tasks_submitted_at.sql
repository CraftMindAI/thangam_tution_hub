-- Track when a student actually submitted their work (via the PDF upload),
-- separate from `status`, which can also be changed manually.
alter table public.tasks add column if not exists submitted_at timestamptz;
