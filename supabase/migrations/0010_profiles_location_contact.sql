-- Student contact details now live on the profile (the standalone students
-- roster table is being retired). location is required for students; parent
-- phone / email are optional.
alter table public.profiles
  add column if not exists location text,
  add column if not exists parent_phone text,
  add column if not exists parent_email text;

-- Students need a location; admins are exempt. NOT VALID so pre-existing rows
-- are not retroactively rejected — only new writes are checked.
alter table public.profiles drop constraint if exists profiles_location_required;
alter table public.profiles
  add constraint profiles_location_required
  check (role = 'admin' or (location is not null and length(trim(location)) > 0))
  not valid;
