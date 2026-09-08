-- Recurring meetings are now materialised as one row per day.
-- series_id groups the occurrences that were created together.
alter table public.calendar_events
  add column if not exists series_id uuid;

create index if not exists calendar_events_series_idx
  on public.calendar_events (series_id);
