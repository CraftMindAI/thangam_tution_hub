-- Enquiry workflow: student submits a duration request, admin reviews with a
-- proposal (duration/payment/date/up-to-3 candidate times) or rejects,
-- student picks a time and pays, admin schedules the class.
alter table public.student_enquiries
  add column if not exists status text not null default 'requested'
    check (status in ('requested', 'reviewed', 'rejected', 'paid', 'scheduled')),
  add column if not exists duration_requested_minutes integer
    check (duration_requested_minutes is null or duration_requested_minutes between 40 and 90),
  add column if not exists admin_duration_minutes integer
    check (admin_duration_minutes is null or admin_duration_minutes between 40 and 90),
  add column if not exists payment_amount numeric(10, 2),
  add column if not exists proposed_date date,
  -- Up to 3 candidate "HH:MM" times the admin offers, e.g. ["18:00", "20:00"].
  add column if not exists suggested_times jsonb not null default '[]'::jsonb,
  add column if not exists chosen_time text,
  add column if not exists admin_note text,
  add column if not exists reviewed_by uuid references auth.users (id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists paid_at timestamptz,
  add column if not exists scheduled_event_id uuid references public.calendar_events (id) on delete set null,
  add column if not exists scheduled_at timestamptz;

-- Only insert + select existed before; admin needs to review/schedule and the
-- student needs to pick a time slot and mark their own row paid.
drop policy if exists "student_enquiries_update_own_or_admin" on public.student_enquiries;
create policy "student_enquiries_update_own_or_admin"
  on public.student_enquiries for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());
