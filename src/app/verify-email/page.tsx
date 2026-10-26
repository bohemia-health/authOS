"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SetLocalNav } from "@asclepius/ui";
import { authClient } from "@/lib/auth-client";
import { accountNav } from "@/lib/account-nav";

// Landing page for the link in the verification email. Asclepius verifies the
// token and redirects here; a failed token arrives with ?error=.
function Status() {
  const params = useSearchParams();
  const error = params.get("error");
  const { data: session } = authClient.useSession();
  const [resent, setResent] = useState(false);

  async function resend() {
    if (!session) return;
    await authClient.sendVerificationEmail({
      email: session.user.email,
      callbackURL: `${window.location.origin}/verify-email`,
    });
    setResent(true);
  }

  if (error) {
    return (
      <>
        <p className="text-muted-foreground">That verification link is invalid or has expired.</p>
        {session && !session.user.emailVerified && (
          <button type="button" onClick={resend} disabled={resent} className="mt-4 underline">
            {resent ? "Sent. Check your inbox." : "Send a new link"}
          </button>
        )}
      </>
    );
  }
  return (
    <>
      <p className="text-muted-foreground">Your email is verified. You&rsquo;re all set.</p>
      <p className="mt-4">
        <Link href="/">Continue</Link>
      </p>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <main>
      <SetLocalNav {...accountNav} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-6 py-12 text-center md:max-w-lg md:py-16 lg:max-w-xl">
        <h1 className="text-3xl font-medium tracking-tight">Email verification</h1>
        <Suspense fallback={null}>
          <Status />
        </Suspense>
      </div>
    </main>
  );
}
