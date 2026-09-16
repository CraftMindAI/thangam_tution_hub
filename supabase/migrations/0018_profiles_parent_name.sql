-- Parent's name was only ever captured on new_student_requests, never copied
-- onto the profile — the student profile page needs it alongside the parent
-- phone/email that already live on profiles.
alter table public.profiles
  add column if not exists parent_name text;
