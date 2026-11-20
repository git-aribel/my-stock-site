import { COMMISSION_PERCENT } from "@/lib/affiliates";

// A made-up example of the affiliate dashboard, for the marketing page.
// 100 members joined through the link: 60 monthly ($19), 24 quarterly ($49)
// and 16 annual ($182), one payment each so far.
const PLANS = [
  { name: "Monthly", price: 19, members: 60 },
  { name: "3 Months", price: 49, members: 24 },
  { name: "Annual", price: 182, members: 16 },
];

const totalEarned = PLANS.reduce(
  (sum, p) => sum + p.price * p.members * (COMMISSION_PERCENT / 100),
  0,
);
const onHold = 433.2;
const ready = 365.4;
const paid = totalEarned - onHold - ready;

const history = [
  { date: "18 Nov 2026", plan: 2, status: "Pending" },
  { date: "17 Nov 2026", plan: 0, status: "Pending" },
  { date: "15 Nov 2026", plan: 1, status: "Pending" },
  { date: "12 Nov 2026", plan: 0, status: "Pending" },
  { date: "30 Sep 2026", plan: 2, status: "Paid" },
];

function money(n: number) {
  return `$${n.toFixed(2)}`;
}

const label = "text-[0.55rem] uppercase tracking-[0.25em] text-cocoa/60";

export default function DashboardPreview() {
  return (
    <figure className="mx-auto mt-14 max-w-3xl">
      <div
        aria-hidden="true"
        className="overflow-hidden border border-cocoa/25 bg-paper shadow-[0_20px_50px_-20px_rgba(74,47,39,0.45)]"
      >
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-cocoa/15 bg-cream px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-deep" />
          <span className="h-2.5 w-2.5 rounded-full bg-rose" />
          <span className="h-2.5 w-2.5 rounded-full bg-dusty-blue" />
          <span className="ml-3 truncate font-serif text-sm text-cocoa/60">
            Your affiliate dashboard
          </span>
        </div>

        <div className="space-y-7 p-6 md:p-8">
          <div>
            <p className={label}>Your link</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="border border-cocoa/25 bg-cream px-3 py-1.5 font-mono text-sm text-cocoa">
                socialsbestie.com/?ref=yourname
              </span>
              <span className="bg-cocoa px-4 py-2 text-[0.55rem] uppercase tracking-[0.25em] text-periwinkle">
                Copy link
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {[
              { k: "Payments", v: "100" },
              { k: "On hold", v: money(onHold) },
              { k: "Ready to pay", v: money(ready) },
              { k: "Paid out", v: money(paid) },
            ].map((s) => (
              <div key={s.k} className="border-l-2 border-rose pl-3">
                <p className={label}>{s.k}</p>
                <p className="mt-1 font-serif text-2xl text-ink">{s.v}</p>
              </div>
            ))}
          </div>

          <div>
            <p className={label}>History</p>
            <table className="mt-2 w-full font-serif text-base text-ink/85">
              <thead>
                <tr className="text-left text-[0.55rem] uppercase tracking-[0.2em] text-cocoa/60">
                  <th className="pb-2 font-normal">Date</th>
                  <th className="hidden pb-2 font-normal sm:table-cell">Plan</th>
                  <th className="pb-2 font-normal">Payment</th>
                  <th className="pb-2 font-normal">You earn</th>
                  <th className="pb-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => {
                  const p = PLANS[h.plan];
                  return (
                    <tr key={i} className="border-t border-cocoa/15">
                      <td className="py-1.5">{h.date}</td>
                      <td className="hidden py-1.5 sm:table-cell">{p.name}</td>
                      <td className="py-1.5">{money(p.price)}</td>
                      <td className="py-1.5">
                        {money((p.price * COMMISSION_PERCENT) / 100)}
                      </td>
                      <td className="py-1.5">{h.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="mt-2 font-serif text-sm text-cocoa/50">
              + 95 more payments
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center font-serif text-base text-cocoa/60">
        Example: 100 people joined through your link. Your dashboard shows
        every payment and what you&apos;ve earned, {money(totalEarned)} so far.
      </figcaption>
    </figure>
  );
}
