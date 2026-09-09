-- An "Inquiry" meeting is about one student's enquiry, so it targets that
-- student directly instead of a whole class.
alter table public.calendar_events
  add column if not exists enquiry_user_id uuid references auth.users (id) on delete set null;

create index if not exists calendar_events_enquiry_user_idx
  on public.calendar_events (enquiry_user_id);
