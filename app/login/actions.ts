"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/app.config";
import { createClient } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const owner = appConfig.ownerEmail.trim().toLowerCase();

  if (!owner) {
    redirect("/login?status=no-owner");
  }

  // Owner-only gate: customer sign-in is a separate, explicit step that
  // requires custom SMTP first (Supabase's built-in mailer never delivers
  // to customers). Until then, exactly one address gets a link.
  if (email !== owner) {
    redirect("/login?status=not-owner");
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm?next=/owner`,
    },
  });

  if (error) {
    redirect("/login?status=send-failed");
  }
  redirect("/login?status=sent");
}
