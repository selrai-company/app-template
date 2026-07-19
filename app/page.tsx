import { appConfig } from "@/app.config";

// Health status must reflect the moment the page is loaded, not the build.
export const dynamic = "force-dynamic";

type Check = { label: string; ok: boolean; detail: string };

async function checkSupabase(url: string, anonKey: string): Promise<Check> {
  const label = "Supabase connectivity";
  const base = url.replace(/\/+$/, "");
  try {
    new URL(base);
  } catch {
    return { label, ok: false, detail: "invalid URL — include https://" };
  }
  try {
    // The REST root validates the anon key, so a wrong key can't show green.
    const res = await fetch(`${base}/rest/v1/`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok
      ? { label, ok: true, detail: "connected" }
      : { label, ok: false, detail: `HTTP ${res.status}` };
  } catch {
    return { label, ok: false, detail: "unreachable" };
  }
}

export default async function Home() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks: Check[] = [
    {
      label: "Env: NEXT_PUBLIC_SUPABASE_URL",
      ok: Boolean(url),
      detail: url ? "set" : "missing",
    },
    {
      label: "Env: NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ok: Boolean(anonKey),
      detail: anonKey ? "set" : "missing",
    },
    url && anonKey
      ? await checkSupabase(url, anonKey)
      : {
          label: "Supabase connectivity",
          ok: false,
          detail: "skipped — envs missing",
        },
  ];

  const healthy = checks.every((c) => c.ok);

  return (
    <main>
      <h1>{appConfig.businessName}</h1>
      <p className="tagline">
        {healthy
          ? "This app is live and connected."
          : "This app is live — finishing setup."}
      </p>
      <section className="health">
        <h2>Health check</h2>
        <ul>
          {checks.map((c) => (
            <li key={c.label}>
              <span>{c.label}</span>
              <span className={c.ok ? "ok" : "fail"}>
                {c.ok ? "✓" : "✗"} {c.detail}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
