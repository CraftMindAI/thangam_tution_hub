-- Profiles: one row per auth user, carrying their role.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('admin', 'existing_student', 'new_student')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security definer so policies on other tables can check admin status
-- without recursively hitting RLS on profiles itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- Self-signup may only claim existing_student / new_student, never admin.
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id and role in ('existing_student', 'new_student'));

-- Existing-student intake + feedback form
create table if not exists public.existing_student_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  student_name text not null,
  parent_name text not null,
  parent_contact text not null,
  standard text not null,
  subject text not null,
  chapter_unit text not null,
  expected_class_date date not null,
  expected_class_time time not null,
  feedback_rating text check (feedback_rating in ('not_satisfied', 'somewhat_good', 'excellent')),
  created_at timestamptz not null default now()
);

alter table public.existing_student_requests enable row level security;

drop policy if exists "existing_student_requests_select" on public.existing_student_requests;
create policy "existing_student_requests_select"
  on public.existing_student_requests for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "existing_student_requests_insert" on public.existing_student_requests;
create policy "existing_student_requests_insert"
  on public.existing_student_requests for insert
  with check (auth.uid() = user_id);

-- New-student intake form
create table if not exists public.new_student_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  contact_person_name text not null,
  relationship_with_student text not null,
  student_name text not null,
  standard text not null,
  followup_contact_name text not null,
  followup_contact_number text not null,
  meeting_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.new_student_requests enable row level security;

drop policy if exists "new_student_requests_select" on public.new_student_requests;
create policy "new_student_requests_select"
  on public.new_student_requests for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "new_student_requests_insert" on public.new_student_requests;
create policy "new_student_requests_insert"
  on public.new_student_requests for insert
  with check (auth.uid() = user_id);
