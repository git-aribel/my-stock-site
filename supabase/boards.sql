-- Members' boards of saved library items (e.g. "Spring launch").
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  created_at timestamptz not null default now()
);

create table if not exists public.board_items (
  board_id uuid not null references public.boards (id) on delete cascade,
  item_id uuid not null references public.content_items (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (board_id, item_id)
);

create index if not exists boards_user_idx on public.boards (user_id, created_at);

-- Each person can only see and change their own boards.
alter table public.boards enable row level security;
alter table public.board_items enable row level security;

drop policy if exists "Own boards" on public.boards;
create policy "Own boards" on public.boards
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Own board items" on public.board_items;
create policy "Own board items" on public.board_items
  for all using (
    board_id in (select id from public.boards where user_id = auth.uid())
  ) with check (
    board_id in (select id from public.boards where user_id = auth.uid())
  );
