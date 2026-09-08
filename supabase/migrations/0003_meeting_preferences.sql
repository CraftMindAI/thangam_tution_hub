-- Global video-meeting preferences, editable by admins only.
create table if not exists public.meeting_preferences (
  id text primary key default 'global',
  audio_enabled boolean not null default true,
  video_enabled boolean not null default true,
  chat_enabled boolean not null default true,
  breakout_enabled boolean not null default false,
  student_email_notifications boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

alter table public.meeting_preferences enable row level security;

-- Ensure the single global row exists.
insert into public.meeting_preferences (id) values ('global')
  on conflict (id) do nothing;

-- Any signed-in user may read the preferences.
drop policy if exists "meeting_preferences_select" on public.meeting_preferences;
create policy "meeting_preferences_select"
  on public.meeting_preferences for select
  using (auth.uid() is not null);

-- Only admins may change them.
drop policy if exists "meeting_preferences_update_admin" on public.meeting_preferences;
create policy "meeting_preferences_update_admin"
  on public.meeting_preferences for update
  using (public.is_admin())
  with check (public.is_admin());
