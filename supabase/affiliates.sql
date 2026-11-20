-- Affiliate program tables.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  code text not null unique check (code ~ '^[a-z0-9-]{3,24}$'),
  payout_email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

-- One row per paid invoice from a referred member.
create table if not exists public.affiliate_commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates (id) on delete cascade,
  referred_user_id uuid references auth.users (id) on delete set null,
  stripe_invoice_id text not null unique,
  stripe_subscription_id text,
  amount_paid integer not null,   -- what the member paid, in cents
  commission integer not null,    -- what the affiliate earns, in cents
  currency text not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'void')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists affiliate_commissions_affiliate_idx
  on public.affiliate_commissions (affiliate_id, created_at desc);

-- Row level security: affiliates can read their own data.
-- All writes go through the server with the service role key.
alter table public.affiliates enable row level security;
alter table public.affiliate_commissions enable row level security;

drop policy if exists "Affiliates read own row" on public.affiliates;
create policy "Affiliates read own row" on public.affiliates
  for select using (auth.uid() = user_id);

drop policy if exists "Affiliates read own commissions" on public.affiliate_commissions;
create policy "Affiliates read own commissions" on public.affiliate_commissions
  for select using (
    affiliate_id in (select id from public.affiliates where user_id = auth.uid())
  );
