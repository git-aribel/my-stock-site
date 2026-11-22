-- Reviews left by people with a Socials Bestie account (free or member).
-- New reviews wait for your approval in /admin/reviews before anyone sees them.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  -- one review per account; they can edit it later
  user_id uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  role text check (role is null or char_length(role) <= 80),
  rating int not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 10 and 800),
  status text not null default 'pending' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_status_idx on public.reviews (status, created_at desc);

alter table public.reviews enable row level security;

-- Everyone can read approved reviews; people can also see their own.
drop policy if exists "Read approved or own reviews" on public.reviews;
create policy "Read approved or own reviews" on public.reviews
  for select to anon, authenticated
  using (status = 'approved' or auth.uid() = user_id);

-- Logged-in people can write their own review. It always starts as
-- 'pending', and goes back to 'pending' whenever they edit it.
drop policy if exists "Write own review" on public.reviews;
create policy "Write own review" on public.reviews
  for insert to authenticated
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Edit own review" on public.reviews;
create policy "Edit own review" on public.reviews
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and status = 'pending');

drop policy if exists "Delete own review" on public.reviews;
create policy "Delete own review" on public.reviews
  for delete to authenticated
  using (auth.uid() = user_id);

-- Approving and hiding is done by you in /admin/reviews (server only).
