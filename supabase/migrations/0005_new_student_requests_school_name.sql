alter table public.new_student_requests
  add column if not exists school_name text;
