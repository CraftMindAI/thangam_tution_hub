create table if not exists public.demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.demo_requests enable row level security;

-- Public enquiry form: anyone (including anonymous visitors) can submit a
-- demo request, but only admins can read submissions back.
drop policy if exists "demo_requests_insert_public" on public.demo_requests;
create policy "demo_requests_insert_public"
  on public.demo_requests for insert
  with check (true);

drop policy if exists "demo_requests_select_admin" on public.demo_requests;
create policy "demo_requests_select_admin"
  on public.demo_requests for select
  using (public.is_admin());
