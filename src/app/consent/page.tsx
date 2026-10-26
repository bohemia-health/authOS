"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, SetLocalNav } from "@asclepius/ui";
import { authClient } from "@/lib/auth-client";
import { accountNav } from "@/lib/account-nav";

const SCOPE_TEXT: Record<string, string> = {
  openid: "Confirm who you are",
  profile: "See your name",
  email: "See your email address",
  offline_access: "Stay signed in without asking again",
};

// Another Bohemia app asked Asclepius for access on this person's behalf.
// Asclepius sent them here with the request in the query string; the client
// plugin forwards that query with the decision, and Asclepius answers with
// where to send them next.
function ConsentForm() {
  const params = useSearchParams();
  const clientId = params.get("client_id") ?? "an application";
  const scopes = (params.get("scope") ?? "").split(" ").filter(Boolean);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"allow" | "deny" | null>(null);

  async function decide(accept: boolean) {
    setPending(accept ? "allow" : "deny");
    setError(null);
    const { data, error } = await authClient.oauth2.consent({ accept });
    if (error) {
      setPending(null);
      return setError(error.message ?? "Something went wrong");
    }
    if (data && typeof data.url === "string") window.location.href = data.url;
  }

  return (
    <>
      <p className="text-muted-foreground">
        <span className="text-foreground">{clientId}</span> wants to use your Bohemia account to:
      </p>
      <ul className="mx-auto mt-4 w-full max-w-sm list-disc space-y-1 pl-5 text-left text-sm">
        {scopes.map((s) => (
          <li key={s}>{SCOPE_TEXT[s] ?? s}</li>
        ))}
      </ul>
      {error && <p role="alert" className="mt-4 text-destructive">{error}</p>}
      <div className="mt-8 flex justify-center gap-3">
        <Button variant="outline" disabled={pending !== null} onClick={() => decide(false)}>
          {pending === "deny" ? "Cancelling…" : "Cancel"}
        </Button>
        <Button disabled={pending !== null} onClick={() => decide(true)}>
          {pending === "allow" ? "Allowing…" : "Allow"}
        </Button>
      </div>
    </>
  );
}

export default function ConsentPage() {
  return (
    <main>
      <SetLocalNav {...accountNav} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-6 py-12 text-center md:max-w-lg md:py-16 lg:max-w-xl">
        <h1 className="text-3xl font-medium tracking-tight">Allow access?</h1>
        <Suspense fallback={null}>
          <ConsentForm />
        </Suspense>
      </div>
    </main>
  );
}
