-- Posts planned in the free Content Calendar tool (/tools/content-calendar).
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.content_calendar_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date date not null,
  time text check (time is null or time ~ '^[0-2][0-9]:[0-5][0-9]$'),
  platform text not null,
  format text not null,
  title text not null check (char_length(title) <= 200),
  caption text check (char_length(caption) <= 5000),
  status text not null default 'idea' check (status in ('idea', 'draft', 'scheduled', 'posted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_calendar_posts_user_date_idx
  on public.content_calendar_posts (user_id, date);

-- Each person can only see and change their own posts.
alter table public.content_calendar_posts enable row level security;

drop policy if exists "Own calendar posts" on public.content_calendar_posts;
create policy "Own calendar posts" on public.content_calendar_posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
