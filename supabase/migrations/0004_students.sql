-- Managed student roster (manual entry + Excel import), admin-only.
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class text not null,
  school text not null,
  email text not null,
  phone text not null,
  parent_email text,
  parent_phone text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id)
);

alter table public.students enable row level security;

drop policy if exists "students_select_admin" on public.students;
create policy "students_select_admin"
  on public.students for select
  using (public.is_admin());

drop policy if exists "students_insert_admin" on public.students;
create policy "students_insert_admin"
  on public.students for insert
  with check (public.is_admin());

drop policy if exists "students_update_admin" on public.students;
create policy "students_update_admin"
  on public.students for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "students_delete_admin" on public.students;
create policy "students_delete_admin"
  on public.students for delete
  using (public.is_admin());
