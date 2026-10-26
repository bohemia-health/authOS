"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FloatingInput, SetLocalNav } from "@asclepius/ui";
import { authClient } from "@/lib/auth-client";
import { accountNav } from "@/lib/account-nav";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const invalid = params.get("error") === "INVALID_TOKEN" || !token;
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const newPassword = String(form.get("password"));
    if (newPassword !== String(form.get("confirmPassword"))) {
      return setError("Passwords don't match.");
    }
    setPending(true);
    setError(null);
    const { error } = await authClient.resetPassword({ newPassword, token: token! });
    setPending(false);
    if (error) return setError(error.message ?? "Couldn't reset your password");
    router.push("/login?reset=1");
  }

  if (invalid) {
    return (
      <>
        <p className="text-muted-foreground">
          This reset link is invalid or has expired.
        </p>
        <p className="mt-4">
          <Link href="/forgot-password">Request a new one</Link>
        </p>
      </>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col items-center gap-3">
      <FloatingInput
        id="password"
        name="password"
        type="password"
        label="New password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <FloatingInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm new password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      {error && <p role="alert">{error}</p>}
      <button disabled={pending}>{pending ? "Saving…" : "Save new password"}</button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main>
      <SetLocalNav {...accountNav} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-6 py-12 text-center md:max-w-lg md:py-16 lg:max-w-xl">
        <h1 className="text-3xl font-medium tracking-tight">Choose a new password</h1>
        {/* useSearchParams needs a Suspense boundary for the static shell. */}
        <Suspense fallback={null}>
          <ResetForm />
        </Suspense>
      </div>
    </main>
  );
}
