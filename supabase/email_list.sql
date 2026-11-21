-- Email list + 15% welcome offer.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

-- People who signed up for the welcome offer and agreed to receive emails
create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'welcome-offer',
  consent_text text not null,
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Their personal one-time discount code (created in Stripe)
alter table public.email_subscribers add column if not exists promo_code text;
alter table public.email_subscribers add column if not exists promo_code_id text;

-- Only the server (service role key) reads and writes subscribers.
alter table public.email_subscribers enable row level security;
