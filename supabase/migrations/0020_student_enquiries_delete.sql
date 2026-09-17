-- Students can delete their own enquiry (the app only allows this while it's
-- still 'requested' — enforced in the server action, not here, same as the
-- update policy already doesn't restrict which fields/status can change).
drop policy if exists "student_enquiries_delete_own_or_admin" on public.student_enquiries;
create policy "student_enquiries_delete_own_or_admin"
  on public.student_enquiries for delete
  using (auth.uid() = user_id or public.is_admin());
