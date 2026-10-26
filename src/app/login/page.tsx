"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CAPTCHA_ENABLED, Captcha, captchaHeaders } from "@/components/captcha";
import { accountNav } from "@/lib/account-nav";
import { safeReturnTo } from "@/lib/return-to";
import { FloatingInput, SetLocalNav } from "@asclepius/ui";

function LoginForm() {
  const router = useRouter();
  const returnTo = safeReturnTo(useSearchParams().get("redirect"));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [captcha, setCaptcha] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { data, error } = await authClient.signIn.email({
      fetchOptions: captchaHeaders(captcha),
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) return setError(error.message ?? "Sign in failed");
    // If another app sent the person here, Asclepius answers with where to
    // send them back; otherwise stay on the account home.
    if (data && "url" in data && typeof data.url === "string") {
      window.location.href = data.url;
      return;
    }
    if (returnTo.startsWith("/")) router.push(returnTo);
    else window.location.href = returnTo;
  }

  return (
    <main>
      <SetLocalNav {...accountNav} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-6 py-12 text-center md:max-w-lg md:py-16 lg:max-w-xl">
        <h1 className="text-3xl font-medium tracking-tight">Log in</h1>
        <p className="">One login is all you need to access the store.</p>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <FloatingInput
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            required
          />

          <FloatingInput
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
          />

          <p className="w-full text-right text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </p>

          <Captcha onToken={setCaptcha} />

          {error && <p role="alert">{error}</p>}
          <button disabled={pending || (CAPTCHA_ENABLED && !captcha)}>
            {pending ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p>
          No account? <Link href={`/signup${returnTo !== "/" ? `?redirect=${encodeURIComponent(returnTo)}` : ""}`}>Sign up</Link>
        </p>
      </div>
    </main>
  );
}

// useSearchParams (the ?redirect= read) needs a Suspense boundary so the
// page's static shell can still be prerendered.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
