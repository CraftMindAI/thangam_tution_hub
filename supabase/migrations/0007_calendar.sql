-- Admin calendar: scheduled meetings + per-student invite list.
create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_type text not null check (meeting_type in ('daily', 'demo', 'inquiry')),
  starts_at timestamptz not null,
  duration_minutes integer not null default 30,
  repeat_daily boolean not null default false,
  class_filter text,
  call_id text,
  notes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.calendar_events enable row level security;

drop policy if exists "calendar_events_admin" on public.calendar_events;
create policy "calendar_events_admin"
  on public.calendar_events for all
  using (public.is_admin())
  with check (public.is_admin());

create table if not exists public.calendar_event_invites (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.calendar_events (id) on delete cascade,
  student_id uuid references public.students (id) on delete set null,
  student_name text not null,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists calendar_event_invites_event_idx
  on public.calendar_event_invites (event_id);

alter table public.calendar_event_invites enable row level security;

drop policy if exists "calendar_event_invites_admin" on public.calendar_event_invites;
create policy "calendar_event_invites_admin"
  on public.calendar_event_invites for all
  using (public.is_admin())
  with check (public.is_admin());
