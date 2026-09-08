create table if not exists public.student_enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  subject text not null,
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.student_enquiries enable row level security;

drop policy if exists "student_enquiries_insert_own" on public.student_enquiries;
create policy "student_enquiries_insert_own"
  on public.student_enquiries for insert
  with check (auth.uid() = user_id);

drop policy if exists "student_enquiries_select_own_or_admin" on public.student_enquiries;
create policy "student_enquiries_select_own_or_admin"
  on public.student_enquiries for select
  using (auth.uid() = user_id or public.is_admin());
