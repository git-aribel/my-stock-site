-- Inquiries from the service pages (/services/...).
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.service_inquiries (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  name text not null,
  email text not null,
  business text,
  budget text,
  timeline text,
  message text not null,
  details jsonb not null default '{}'::jsonb, -- answers to the service's own questions
  status text not null default 'new' check (status in ('new', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists service_inquiries_created_idx
  on public.service_inquiries (created_at desc);

-- Only the server (service role key) reads and writes inquiries.
-- No policies means visitors can't read anyone's inquiry.
alter table public.service_inquiries enable row level security;
