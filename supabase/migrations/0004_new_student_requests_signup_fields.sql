-- The old new_student / existing_student choice screen on /signup was
-- removed. new_student_requests now only stores what the plain signup
-- form actually collects: student name, class, parent name/phone, and a
-- scheduled Zoom meeting time.
alter table public.new_student_requests
  rename column contact_person_name to parent_name;

alter table public.new_student_requests
  rename column followup_contact_number to parent_phone;

alter table public.new_student_requests
  drop column relationship_with_student,
  drop column followup_contact_name;
