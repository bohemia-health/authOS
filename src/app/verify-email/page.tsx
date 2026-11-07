"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingInput, SetLocalNav } from "@asclepius/ui";
import { authClient } from "@/lib/auth-client";
import { accountNav } from "@/lib/account-nav";
import { safeReturnTo } from "@/lib/return-to";

// Where people enter the 6-digit code from the verification email. Signup
// sends them here signed in, so the email comes from the session; someone who
// opens the page signed out types their email alongside the code.

// Turns Asclepius's emailOTP error codes into something a person can act on.
function messageFor(code: string | undefined) {
  switch (code) {
    case "INVALID_OTP":
      return "That code isn't right. Check the email and try again.";
    case "OTP_EXPIRED":
      return "That code has expired. Send a new one below.";
    case "TOO_MANY_ATTEMPTS":
      return "Too many wrong codes. Send a new one below.";
    default:
      return "We couldn't verify that code. Please try again.";
  }
}

function VerifyForm() {
  const router = useRouter();
  const returnTo = safeReturnTo(useSearchParams().get("redirect"));
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resent, setResent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [typedEmail, setTypedEmail] = useState("");

  const email = session?.user.email ?? typedEmail;

  function continueOn() {
    if (returnTo.startsWith("/")) router.push(returnTo);
    else window.location.href = returnTo;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const form = new FormData(e.currentTarget);
    // The email shows the code as "234 - 456"; accept it typed any way.
    const otp = String(form.get("code")).replace(/\D/g, "");
    if (otp.length !== 6) return setError("Enter the 6-digit code from the email.");
    setPending(true);
    setError(null);
    try {
      const { error } = await authClient.emailOtp.verifyEmail({ email: email.trim(), otp });
      if (error) return setError(messageFor(error.code));
      setVerified(true);
    } catch {
      setError("We couldn't connect. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  async function resend() {
    if (!email.trim()) return setError("Enter your email address first.");
    setError(null);
    await authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: "email-verification" });
    setResent(true);
  }

  if (sessionLoading) return null;

  if (verified || session?.user.emailVerified) {
    return (
      <>
        <p className="text-muted-foreground">Your email is verified. You&rsquo;re all set.</p>
        <button type="button" onClick={continueOn} className="mt-6">
          Continue
        </button>
      </>
    );
  }

  return (
    <>
      <p className="text-muted-foreground">
        {session ? (
          <>We sent a 6-digit code to <strong className="text-foreground">{session.user.email}</strong>. Enter it below to verify your email address.</>
        ) : (
          <>Enter your email address and the 6-digit code we sent you.</>
        )}
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col items-center gap-3" aria-busy={pending}>
        {!session && (
          <FloatingInput
            id="email"
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            value={typedEmail}
            onChange={(e) => setTypedEmail(e.target.value)}
            required
          />
        )}
        <FloatingInput
          id="code"
          name="code"
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={9}
          required
        />
        {error && <p role="alert">{error}</p>}
        <button disabled={pending}>{pending ? "Verifying…" : "Verify email"}</button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Didn&rsquo;t get it?{" "}
        <button type="button" onClick={resend} disabled={resent} className="underline">
          {resent ? "Sent. Check your inbox." : "Send a new code"}
        </button>
      </p>
      {!session && (
        <p className="text-sm">
          <Link href="/login">Log in instead</Link>
        </p>
      )}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <main>
      <SetLocalNav {...accountNav} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-6 py-12 text-center md:max-w-lg md:py-16 lg:max-w-xl">
        <h1 className="text-3xl font-medium tracking-tight">Verify your email</h1>
        <Suspense fallback={null}>
          <VerifyForm />
        </Suspense>
      </div>
    </main>
  );
}
