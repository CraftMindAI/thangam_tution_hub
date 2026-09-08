-- Calendar events: description + file attachment.
alter table public.calendar_events
  add column if not exists description text,
  add column if not exists attachment_url text,
  add column if not exists attachment_name text;

-- Public bucket for invite attachments (uploaded with the service role).
insert into storage.buckets (id, name, public)
  values ('event-attachments', 'event-attachments', true)
  on conflict (id) do nothing;
