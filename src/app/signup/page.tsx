"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { CAPTCHA_ENABLED, Captcha, captchaHeaders } from "@/components/captcha";
import { accountNav } from "@/lib/account-nav";
import { safeReturnTo } from "@/lib/return-to";
import { STORE_URL } from "@/lib/store";
import { BirthdaySelect, readBirthday, FloatingInput, Separator, Checkbox, SetLocalNav } from "@asclepius/ui";

export default function SignupPage() {
  const router = useRouter();
  const returnTo = safeReturnTo(useSearchParams().get("redirect"));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [captcha, setCaptcha] = useState("");

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
    const { data, error } = await authClient.signUp.email({
      fetchOptions: captchaHeaders(captcha),
      // The verification email's link lands back on this site.
      callbackURL: `${window.location.origin}/verify-email`,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      birthDate,
      email: String(form.get("email")),
      password,
      marketingOptIn: form.get("marketingOptIn") === "on",
    });
    setPending(false);
    if (error) return setError(error.message ?? "Sign up failed");
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
        <h1 className="text-3xl font-medium tracking-tight">
          Create Your Free Account
        </h1>
        <p className="">One login is all you need to access the store.</p>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <div className="flex w-full gap-3">
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

          <Separator className="my-5" />

          <FloatingInput
            id="email"
            name="email"
            type="email"
            label="Name@example.com"
            errorLabel="Email"
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

          <label
            htmlFor="marketingOptIn"
            className="mt-2 flex w-full items-start gap-3 text-left text-sm text-neutral-600"
          >
            <Checkbox id="marketingOptIn" name="marketingOptIn" className="mt-0.5" />
            Send me product announcements, lab report updates, and offers by
            email. You can unsubscribe at any time.
          </label>

          <p className="mt-4 max-w-sm text-xs leading-relaxed text-neutral-500">
            By clicking Sign up, you agree to Bohemia Health&rsquo;s{" "}
            <a
              href={`${STORE_URL}/legal/terms-of-use`}
              className="underline underline-offset-2 hover:text-foreground"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href={`${STORE_URL}/legal`}
              className="underline underline-offset-2 hover:text-foreground"
            >
              Privacy Policy
            </a>
            .
          </p>

          <Captcha onToken={setCaptcha} />

          {error && <p role="alert">{error}</p>}
          <button disabled={pending || (CAPTCHA_ENABLED && !captcha)}>
            {pending ? "Creating…" : "Sign up"}
          </button>
        </form>

        <Separator className="my-5" />

        <p>
          Already have an account? <Link href={`/login${returnTo !== "/" ? `?redirect=${encodeURIComponent(returnTo)}` : ""}`}>Log in</Link>
        </p>
      </div>
    </main>
  );
}
