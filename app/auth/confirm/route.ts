import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { isOwnerEmail } from "@/lib/owner";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

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
  if (!hasSupabaseEnv()) {
    redirect("/login");
  }

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/owner";
  // Stay on this app: allow only a plain in-app path with no control chars
  // ("//host" and "/\host" are protocol-relative escapes, and URL parsers
  // strip \t \r \n — "/\t//host" would sneak one back in).
  const next =
    /^\/(?![/\\])/.test(nextParam) && !/[\x00-\x1f\x7f]/.test(nextParam)
      ? nextParam
      : "/owner";

  const supabase = await createClient();

  let verified = false;
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    verified = !error;
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
  }

  if (!verified) {
    redirect("/login?status=link-expired");
  }

  // Session gate, not just a send gate: whoever the link was for, only the
  // owner keeps a session. The login form already refuses other addresses,
  // but Supabase's OTP endpoint is publicly callable with the anon key —
  // and once custom SMTP is added, the built-in mailer's org-members-only
  // filter no longer protects delivery. This check is what keeps the app
  // owner-only in every one of those worlds.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isOwnerEmail(user?.email)) {
    await supabase.auth.signOut();
    redirect("/login?status=not-owner");
  }

  redirect(next);
}
