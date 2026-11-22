-- To-do lists made in the free To-do lists tool (/tools/to-do-lists).
-- People start from a ready-made checklist or a blank list.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 80),
  emoji text check (emoji is null or char_length(emoji) <= 8),
  -- which ready-made list it came from (null = a blank list they made)
  template text check (template is null or char_length(template) <= 40),
  -- 'daily' / 'weekly' lists untick themselves at the start of each day / week
  resets text not null default 'never' check (resets in ('never', 'daily', 'weekly')),
  -- [{ "id": "...", "text": "...", "done": false }, ...]
  items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) <= 100),
  last_reset date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists checklists_user_idx on public.checklists (user_id, created_at);

-- Each person can only see and change their own lists.
alter table public.checklists enable row level security;

drop policy if exists "Own checklists" on public.checklists;
create policy "Own checklists" on public.checklists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
