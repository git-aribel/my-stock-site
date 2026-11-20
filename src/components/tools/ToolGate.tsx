import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Tools are free, but you need a (free) account to use them.
export default async function ToolGate({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) return <>{children}</>;

  const next = encodeURIComponent(path);

  return (
    <div className="mx-auto max-w-xl border border-cocoa/25 bg-paper p-8 text-center md:p-10">
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cocoa/60">
        Free account
      </p>
      <h2 className="mt-3 font-script text-5xl text-denim">
        Unlock the creator tools
      </h2>
      <p className="mt-4 font-serif text-xl leading-relaxed text-ink/80">
        All our creator tools are free. Create a free account to start using
        them. No card needed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href={`/signup?next=${next}`}
          className="bg-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-periwinkle transition hover:bg-cocoa-deep"
        >
          Create free account
        </Link>
        <Link
          href={`/login?next=${next}`}
          className="border border-cocoa px-6 py-3 text-[0.7rem] uppercase tracking-[0.25em] text-cocoa transition hover:bg-rose/40"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
