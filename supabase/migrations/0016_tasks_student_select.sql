-- Tasks can now be assigned to students, not just admin staff. Students need
-- to read their own assigned tasks and update their own task's status, while
-- everything else (create/delete/reassign) stays admin-only via tasks_admin.
drop policy if exists "tasks_select_own_or_admin" on public.tasks;
create policy "tasks_select_own_or_admin"
  on public.tasks for select
  using (auth.uid() = assigned_to or public.is_admin());

drop policy if exists "tasks_update_own_status_or_admin" on public.tasks;
create policy "tasks_update_own_status_or_admin"
  on public.tasks for update
  using (auth.uid() = assigned_to or public.is_admin())
  with check (auth.uid() = assigned_to or public.is_admin());
