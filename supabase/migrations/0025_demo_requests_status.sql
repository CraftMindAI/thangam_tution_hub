alter table public.demo_requests
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'completed'));

-- Only insert + admin-select existed before; admins need to update status too.
drop policy if exists "demo_requests_update_admin" on public.demo_requests;
create policy "demo_requests_update_admin"
  on public.demo_requests for update
  using (public.is_admin())
  with check (public.is_admin());
