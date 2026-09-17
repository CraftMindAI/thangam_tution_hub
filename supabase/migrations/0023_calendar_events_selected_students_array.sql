-- Replace the calendar_event_selected_students join table with a plain
-- array column on calendar_events — simpler for a "≤ a few dozen hand-picked
-- students per event" list, and one less table to keep RLS in sync for.
alter table public.calendar_events
  add column if not exists selected_student_ids uuid[] not null default '{}';

update public.calendar_events ce
set selected_student_ids = coalesce(agg.ids, '{}')
from (
  select event_id, array_agg(user_id) as ids
  from public.calendar_event_selected_students
  group by event_id
) agg
where agg.event_id = ce.id;

-- The array lives on calendar_events itself now, so the student select
-- policy can check it directly — no more security-definer helper needed
-- (that existed only to dodge RLS recursion into the old join table).
drop policy if exists "calendar_events_select_student" on public.calendar_events;
create policy "calendar_events_select_student"
  on public.calendar_events for select
  using (
    auth.uid() = enquiry_user_id
    or (
      send_to = 'all'
      and (
        class_filter is null
        or class_filter = (select class from public.profiles where id = auth.uid())
      )
    )
    or (send_to = 'selected' and auth.uid() = any(selected_student_ids))
  );

drop function if exists public.is_invited_to_calendar_event(uuid);

drop table if exists public.calendar_event_selected_students;
