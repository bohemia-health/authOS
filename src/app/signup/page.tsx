"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { BirthdaySelect, readBirthday } from "@/components/birthday-select";
import { FloatingInput } from "@/components/floating-input";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const firstName = String(form.get("firstName")).trim();
    const lastName = String(form.get("lastName")).trim();
    const birthDate = readBirthday(form);
    if (!birthDate) return setError("That birthday isn't a real date.");
    const password = String(form.get("password"));
    if (password !== String(form.get("confirmPassword"))) {
      return setError("Passwords don't match.");
    }
    setPending(true);
    setError(null);
    const { error } = await authClient.signUp.email({
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      birthDate,
      email: String(form.get("email")),
      password,
    });
    setPending(false);
    if (error) return setError(error.message ?? "Sign up failed");
    router.push("/");
  }

  return (
    <main>
      <div className="flex flex-col mx-56 py-6 gap-2 text-center">
        <h1 className="text-3xl font-medium tracking-tight">
          Create Your Free Account
        </h1>
        <p className="">One login is all you need to access the store.</p>

        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center gap-2 mt-6"
        >
          <div className="flex w-full gap-2">
            <FloatingInput
              id="firstName"
              name="firstName"
              label="First Name"
              autoComplete="given-name"
              required
            />
            <FloatingInput
              id="lastName"
              name="lastName"
              label="Last Name"
              autoComplete="family-name"
              required
            />
          </div>

          <BirthdaySelect />

          <FloatingInput
            id="email"
            name="email"
            type="email"
            label="Name@example.com"
            autoComplete="email"
            required
          />

          <FloatingInput
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <FloatingInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          {error && <p role="alert">{error}</p>}
          <button disabled={pending}>
            {pending ? "Creating…" : "Sign up"}
          </button>
        </form>

        <p>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
