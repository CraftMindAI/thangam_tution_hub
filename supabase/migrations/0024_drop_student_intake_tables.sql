-- Both intake tables are fully superseded by public.profiles (full_name,
-- class, school, location, parent_name, parent_phone, parent_email already
-- live there — see migrations 0002, 0010, 0012).
--
-- existing_student_requests: empty, and nothing in the app ever wrote to it
-- (only a dead read remained in the student dashboard).
--
-- new_student_requests: signup.ts duplicated student_name/standard/
-- school_name/parent_name/parent_phone into this table on top of profiles;
-- its insert didn't even supply the NOT NULL meeting_at column, so it was
-- already effectively dead weight, not a working feature.
drop table if exists public.existing_student_requests;
drop table if exists public.new_student_requests;
