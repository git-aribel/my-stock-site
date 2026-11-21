-- Daily message count for the members-only AI assistant.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.assistant_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  messages integer not null default 0,
  primary key (user_id, day)
);

-- Only the server (service role key) reads and writes this table.
alter table public.assistant_usage enable row level security;
