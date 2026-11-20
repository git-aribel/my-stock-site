import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { COMMISSION_MONTHS, COMMISSION_PERCENT } from "@/lib/affiliates";

async function saveSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.user_id;
  if (!userId) {
    console.error("Subscription has no user_id metadata:", sub.id);
    return;
  }

  // Stripe moved the period end date in newer API versions, so check both places
  const item = sub.items.data[0] as unknown as { current_period_end?: number };
  const legacy = sub as unknown as { current_period_end?: number };
  const periodEnd = item?.current_period_end ?? legacy.current_period_end;

  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  const admin = createAdminClient();
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: sub.id,
      plan: sub.metadata?.plan ?? null,
      status: sub.status,
      cancel_at_period_end: sub.cancel_at_period_end || sub.cancel_at != null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  if (error) throw error;
}

// Records an affiliate commission when a referred member's invoice is paid.
async function recordCommission(invoice: Stripe.Invoice) {
  const details = invoice.parent?.subscription_details;
  const meta = details?.metadata ?? {};
  const affiliateId = meta.affiliate_id;
  if (!affiliateId) return;

  // Only the first COMMISSION_MONTHS months of the membership earn commission
  const referredAt = Number(meta.referred_at);
  if (referredAt) {
    const end = new Date(referredAt * 1000);
    end.setMonth(end.getMonth() + COMMISSION_MONTHS);
    if (invoice.created * 1000 > end.getTime()) return;
  }

  // Commission is on the price before tax
  const base = Math.min(
    invoice.amount_paid,
    invoice.total_excluding_tax ?? invoice.amount_paid,
  );
  if (base <= 0) return;

  const subscriptionId = details?.subscription
    ? typeof details.subscription === "string"
      ? details.subscription
      : details.subscription.id
    : null;

  const admin = createAdminClient();
  const { error } = await admin.from("affiliate_commissions").upsert(
    {
      affiliate_id: affiliateId,
      referred_user_id: meta.user_id ?? null,
      stripe_invoice_id: invoice.id,
      stripe_subscription_id: subscriptionId,
      amount_paid: base,
      commission: Math.round((base * COMMISSION_PERCENT) / 100),
      currency: invoice.currency,
    },
    { onConflict: "stripe_invoice_id", ignoreDuplicates: true },
  );

  if (error) throw error;
}

// Reduces or cancels an unpaid commission when the payment is refunded.
async function handleRefund(charge: Stripe.Charge) {
  const paymentIntent =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;
  if (!paymentIntent) return;

  const payments = await stripe.invoicePayments.list({
    payment: { type: "payment_intent", payment_intent: paymentIntent },
    limit: 1,
  });
  const inv = payments.data[0]?.invoice;
  const invoiceId = typeof inv === "string" ? inv : inv?.id;
  if (!invoiceId) return;

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("affiliate_commissions")
    .select("id, amount_paid, status")
    .eq("stripe_invoice_id", invoiceId)
    .maybeSingle();
  if (!row) return;

  if (row.status === "paid") {
    console.warn("Refund on an invoice whose commission was already paid:", invoiceId);
    return;
  }

  const kept = Math.max(0, row.amount_paid - charge.amount_refunded);
  const { error } = await admin
    .from("affiliate_commissions")
    .update(
      charge.refunded || kept === 0
        ? { status: "void", commission: 0 }
        : { commission: Math.round((kept * COMMISSION_PERCENT) / 100) },
    )
    .eq("id", row.id);

  if (error) throw error;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const id =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(id);
          await saveSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await saveSubscription(event.data.object as Stripe.Subscription);
        break;
      case "invoice.paid":
        await recordCommission(event.data.object as Stripe.Invoice);
        break;
      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
