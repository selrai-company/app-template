import { redirect } from "next/navigation";
import { appConfig } from "@/app.config";
import { isOwnerEmail } from "@/lib/owner";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";

/**
 * The owner area. The proxy already redirects non-owners, but the page
 * checks again — defence in depth, and correct even if the matcher drifts.
 */
export default async function OwnerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isOwnerEmail(user.email)) {
    redirect("/login");
  }

  return (
    <main>
      <h1>{appConfig.businessName}</h1>
      <p className="tagline">Owner area — only you can see this page.</p>
      <section className="card">
        <h2>Signed in</h2>
        <p className="notice ok">✓ {user.email}</p>
        <p className="hint">
          This page is where owner-only features land when you ask for them.
          Files you upload live in the private <code>files</code> storage
          bucket — only signed-in users (you) can read or write it.
        </p>
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </section>
    </main>
  );
}
