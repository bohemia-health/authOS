"use client";

import { useState } from "react";
import Link from "next/link";
import { FloatingInput, SetLocalNav } from "@asclepius/ui";
import { authClient } from "@/lib/auth-client";
import { CAPTCHA_ENABLED, Captcha, captchaHeaders } from "@/components/captcha";
import { accountNav } from "@/lib/account-nav";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [captcha, setCaptcha] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email"));
    setPending(true);
    setError(null);
    const { error } = await authClient.requestPasswordReset({
      fetchOptions: captchaHeaders(captcha),
      email,
      // Asclepius mails a link that lands back here with ?token=
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setPending(false);
    if (error) return setError(error.message ?? "Something went wrong");
    setSent(true);
  }

  return (
    <main>
      <SetLocalNav {...accountNav} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-6 py-12 text-center md:max-w-lg md:py-16 lg:max-w-xl">
        <h1 className="text-3xl font-medium tracking-tight">Reset your password</h1>
        {sent ? (
          <p className="text-muted-foreground">
            If an account exists for that email, a reset link is on its way. It
            expires in one hour.
          </p>
        ) : (
          <>
            <p className="text-muted-foreground">
              Enter the email on your account and we&rsquo;ll send you a link.
            </p>
            <form onSubmit={onSubmit} className="mt-8 flex flex-col items-center gap-3">
              <FloatingInput
                id="email"
                name="email"
                type="email"
                label="Email"
                autoComplete="email"
                required
              />
              <Captcha onToken={setCaptcha} />
              {error && <p role="alert">{error}</p>}
              <button disabled={pending || (CAPTCHA_ENABLED && !captcha)}>
                {pending ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
        <p className="mt-4">
          <Link href="/login">Back to log in</Link>
        </p>
      </div>
    </main>
  );
}
