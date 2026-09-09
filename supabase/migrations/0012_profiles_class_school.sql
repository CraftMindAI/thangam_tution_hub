-- The admin roster (manual add + Excel import) writes straight to
-- auth.users + public.profiles, so class/school belong on the profile rather
-- than on an intake row.
alter table public.profiles
  add column if not exists class text,
  add column if not exists school text;

create index if not exists profiles_class_idx on public.profiles (class);
