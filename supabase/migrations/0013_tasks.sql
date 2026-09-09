-- public.tasks was created directly in Supabase Studio. This migration brings
-- it under version control (so a fresh reset-db rebuilds it identically) and
-- adds the admin policy it was missing — RLS was enabled with no policies at
-- all, which silently blocked every read and write.
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  notes text,
  due_date date,
  due_time time,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  assigned_to uuid not null references auth.users (id) on delete cascade,
  created_by uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists tasks_created_at_idx on public.tasks (created_at desc);
create index if not exists tasks_assigned_to_idx on public.tasks (assigned_to);

alter table public.tasks enable row level security;

-- Tasks are internal: admins only, for every operation.
drop policy if exists "tasks_admin" on public.tasks;
create policy "tasks_admin"
  on public.tasks for all
  using (public.is_admin())
  with check (public.is_admin());
