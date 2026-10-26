"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { FloatingInput } from "@/components/floating-input";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) return setError(error.message ?? "Sign in failed");
    router.push("/");
  }

  return (
    <main>
      <div className="flex flex-col py-6 gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight">Log in</h1>
        <p className="">One login is all you need to access the store.</p>

        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center gap-2 mt-6"
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

          {error && <p role="alert">{error}</p>}
          <button disabled={pending}>
            {pending ? "Signing in…" : "Log in"}
          </button>
        </form>

        <p>
          No account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
