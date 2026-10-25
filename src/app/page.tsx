"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

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
      <button onClick={() => authClient.signOut()}>Sign out</button>
    </main>
  );
}
