import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic-link landing: verifies the emailed token and starts the session.
 *
 * Handles both link shapes Supabase sends:
 * - `?code=...` — the default email template (free-tier projects created
 *   after 2026-06-03 cannot customize templates without custom SMTP; the
 *   default link goes via Supabase's verify endpoint and lands here with a
 *   PKCE code). Must be opened in the same browser that requested it.
 * - `?token_hash=...&type=email` — the customized-template shape used once
 *   custom SMTP is set up.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const nextPath = searchParams.get("next") ?? "/owner";
  // Only ever redirect within this app.
  const next = nextPath.startsWith("/") ? nextPath : "/owner";

  const supabase = await createClient();

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) redirect(next);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) redirect(next);
  }

  redirect("/login?status=link-expired");
}
