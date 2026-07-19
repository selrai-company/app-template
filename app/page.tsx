import { appConfig } from "@/app.config";

// Health status must reflect the moment the page is loaded, not the build.
export const dynamic = "force-dynamic";

type Check = { label: string; ok: boolean; detail: string };

async function checkSupabase(url: string, anonKey: string): Promise<Check> {
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: anonKey },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok
      ? { label: "Supabase connectivity", ok: true, detail: "connected" }
      : {
          label: "Supabase connectivity",
          ok: false,
          detail: `HTTP ${res.status}`,
        };
  } catch {
    return { label: "Supabase connectivity", ok: false, detail: "unreachable" };
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
