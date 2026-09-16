-- Students can now see the "Meetings" sidebar item, showing calendar events
-- relevant to them: class-wide sessions for their class, sessions explicitly
-- addressed to "all" with no class filter, sessions they were hand-picked
-- for (send_to = 'selected'), or an inquiry meeting created for them directly.
--
-- calendar_event_selected_students stays admin-only for direct access; a
-- security-definer function lets the calendar_events policy check membership
-- without recursively hitting that table's own RLS.
create or replace function public.is_invited_to_calendar_event(p_event_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.calendar_event_selected_students
    where event_id = p_event_id and user_id = auth.uid()
  );
$$;

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
    or (send_to = 'selected' and public.is_invited_to_calendar_event(id))
  );
