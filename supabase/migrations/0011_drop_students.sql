-- Retire the standalone students roster. Student data now lives entirely in
-- auth.users + public.profiles, with class/school kept on the intake tables.

-- calendar_event_invites.student_id was an FK to students(id); the invite list
-- already carries student_name + email, so the id column is no longer needed.
alter table public.calendar_event_invites drop column if exists student_id;

-- Admin-added students get a new_student_requests row for class/school but have
-- no scheduled meeting, so meeting_at must be nullable.
alter table public.new_student_requests alter column meeting_at drop not null;

drop table if exists public.students cascade;
