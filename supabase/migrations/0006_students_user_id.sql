-- Link a roster student to their auth account (created via invite on add).
alter table public.students
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists students_user_id_idx on public.students (user_id);
