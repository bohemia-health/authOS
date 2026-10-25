"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) return setError(error.message ?? "Sign up failed");
    router.push("/");
  }

  return (
    <main>
      <h1>Create your account</h1>
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={pending}>{pending ? "Creating…" : "Sign up"}</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
