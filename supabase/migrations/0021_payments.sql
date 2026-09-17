-- Payment receipts for enquiries: who paid, for which enquiry, what contact
-- was used at checkout, and (once the admin schedules it) which meeting it
-- paid for.
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  enquiry_id uuid not null references public.student_enquiries (id) on delete cascade,
  meeting_id uuid references public.calendar_events (id) on delete set null,
  amount numeric(10, 2) not null,
  contact text,
  razorpay_order_id text not null,
  razorpay_payment_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists payments_user_idx on public.payments (user_id);
create index if not exists payments_enquiry_idx on public.payments (enquiry_id);

alter table public.payments enable row level security;

drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin"
  on public.payments for select
  using (auth.uid() = user_id or public.is_admin());

-- The student's own client creates the row right after verifying payment.
drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own"
  on public.payments for insert
  with check (auth.uid() = user_id);

-- Only admins (or the service role, which bypasses RLS) update/delete —
-- e.g. attaching meeting_id once the class is scheduled.
drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all"
  on public.payments for all
  using (public.is_admin())
  with check (public.is_admin());
