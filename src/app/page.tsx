"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@asclepius/ui";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;

  if (!session) {
    return (
      <main>
        <Link href="/login">Log in</Link> · <Link href="/signup">Sign up</Link>
      </main>
    );
  }

  return (
    <main>
      <p>Signed in as {session.user.email}</p>
      {!session.user.emailVerified && (
        <p className="text-sm text-muted-foreground">
          Your email isn&rsquo;t verified yet. Check your inbox, or{" "}
          <button
            type="button"
            className="underline"
            onClick={() =>
              authClient.sendVerificationEmail({
                email: session.user.email,
                callbackURL: `${window.location.origin}/verify-email`,
              })
            }
          >
            send the link again
          </button>
          .
        </p>
      )}
      <Button onClick={() => authClient.signOut()}>Sign out</Button>
    </main>
  );
}
