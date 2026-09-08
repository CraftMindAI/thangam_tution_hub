-- Add a location/area field to the student roster.
alter table public.students
  add column if not exists location text;
