-- Controls who gets the meeting invite email: 'all' (class-filtered) or 'selected' (hand-picked).
alter table public.calendar_events
  add column if not exists send_to text not null default 'all'
    check (send_to in ('all', 'selected'));

-- When send_to = 'selected', this table stores the hand-picked student user IDs.
create table if not exists public.calendar_event_selected_students (
  event_id uuid not null references public.calendar_events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  primary key (event_id, user_id)
);

create index if not exists calendar_event_selected_students_event_idx
  on public.calendar_event_selected_students (event_id);

alter table public.calendar_event_selected_students enable row level security;

drop policy if exists "calendar_event_selected_students_admin" on public.calendar_event_selected_students;
create policy "calendar_event_selected_students_admin"
  on public.calendar_event_selected_students for all
  using (public.is_admin())
  with check (public.is_admin());
