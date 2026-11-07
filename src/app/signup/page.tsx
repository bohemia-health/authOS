"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, FlaskConical, LockKeyhole, ShoppingBag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { CAPTCHA_ENABLED, Captcha, captchaHeaders } from "@/components/captcha";
import { DEFAULT_RETURN_TO, safeReturnTo } from "@/lib/return-to";
import { STORE_URL } from "@/lib/store";
import { BirthdaySelect, readBirthday, FloatingInput, Checkbox } from "@asclepius/ui";
import "./signup.css";

function SignupForm() {
  const router = useRouter();
  const returnTo = safeReturnTo(useSearchParams().get("redirect"));
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
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
    try {
      const { data, error } = await authClient.signUp.email({
        fetchOptions: captchaHeaders(captcha),
        callbackURL: `${window.location.origin}/verify-email`,
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        birthDate,
        email: String(form.get("email")),
        password,
        marketingOptIn: form.get("marketingOptIn") === "on",
      });
      if (error) return setError(error.message ?? "Sign up failed. Please try again.");
      if (data && "url" in data && typeof data.url === "string") {
        window.location.href = data.url;
        return;
      }
      // The verification code is already on its way; enter it next, then
      // the verify page continues on to returnTo.
      router.push(`/verify-email${returnTo !== DEFAULT_RETURN_TO ? `?redirect=${encodeURIComponent(returnTo)}` : ""}`);
    } catch {
      setError("We couldn't connect. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-layout">
        <aside className="signup-intro" aria-labelledby="signup-welcome">
          <div className="signup-eyebrow"><span className="signup-statusDot" /> YOUR BOHEMIA ACCOUNT</div>
          <h2 id="signup-welcome">A little curiosity.<br />A world of <span>possibility.</span></h2>
          <p className="signup-introCopy">Your next discovery starts here. One account brings you closer to everything Bohemia.</p>

          <div className="signup-artwork" aria-hidden="true">
            <div className="signup-orbit" />
            <div className="signup-orbitInner" />
            <div className="signup-sphere" />
            <div className="signup-orbitDot" />
            <span className="signup-artworkLabel">CURIOSITY, CONNECTED.</span>
            <span className="signup-artworkIndex">B / 01</span>
          </div>

          <div className="signup-benefits">
            <div><ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" /><p><strong>The store, at your fingertips.</strong><span>Explore the collection with your Bohemia login.</span></p></div>
            <div><FlaskConical size={20} strokeWidth={1.5} aria-hidden="true" /><p><strong>Keep your curiosity going.</strong><span>Discover products, lab reports, and what comes next.</span></p></div>
          </div>
          <p className="signup-introFootnote">One account. All things Bohemia.</p>
        </aside>

        <section className="signup-formPanel" aria-labelledby="signup-heading">
          <header className="signup-formHeader">
            <span className="signup-kicker">LET’S GET STARTED</span>
            <h1 id="signup-heading">Make yourself at home.</h1>
            <p>Create your free Bohemia account.</p>
          </header>

          <form onSubmit={onSubmit} className="signup-form" aria-busy={pending}>
            <fieldset className="signup-fieldset" disabled={pending}>
              <legend><span>01</span> A little about you</legend>
              <div className="signup-fields">
                <div className="signup-nameRow">
                  <FloatingInput id="firstName" name="firstName" label="First name" autoComplete="given-name" required />
                  <FloatingInput id="lastName" name="lastName" label="Last name" autoComplete="family-name" required />
                </div>
                <BirthdaySelect />
              </div>
            </fieldset>

            <fieldset className="signup-fieldset" disabled={pending}>
              <legend><span>02</span> Your sign-in details</legend>
              <div className="signup-fields">
                <FloatingInput id="email" name="email" type="email" label="Email address" autoComplete="email" autoCapitalize="none" spellCheck={false} required />
                <div className="signup-passwordField">
                  <FloatingInput id="password" name="password" type={showPasswords ? "text" : "password"} label="Password" autoComplete="new-password" aria-describedby="password-hint" minLength={8} required />
                  <button type="button" className="signup-reveal" onClick={() => setShowPasswords(!showPasswords)} aria-label={showPasswords ? "Hide passwords" : "Show passwords"} aria-pressed={showPasswords} aria-controls="password confirmPassword">
                    {showPasswords ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
                <p id="password-hint" className="signup-hint">Use at least 8 characters.</p>
                <FloatingInput id="confirmPassword" name="confirmPassword" type={showPasswords ? "text" : "password"} label="Confirm password" autoComplete="new-password" minLength={8} required />
              </div>
            </fieldset>

            <label htmlFor="marketingOptIn" className="signup-optIn">
              <Checkbox id="marketingOptIn" name="marketingOptIn" disabled={pending} className="mt-0.5 shrink-0" />
              <span><strong>Keep me in the loop</strong><span>Product news, lab report updates, and offers. Unsubscribe anytime.</span></span>
            </label>

            <Captcha onToken={setCaptcha} />
            {error && <p role="alert" className="signup-error">{error}</p>}
            <button type="submit" className="signup-submit" disabled={pending || (CAPTCHA_ENABLED && !captcha)}>
              <span aria-live="polite">{pending ? "Creating your account…" : "Create free account"}</span>
              {!pending && <ArrowRight size={19} aria-hidden="true" />}
            </button>
            <p className="signup-terms">By creating an account, you agree to Bohemia Health’s <a href={`${STORE_URL}/legal/terms-of-use`}>Terms of Use</a> and <a href={`${STORE_URL}/legal`}>Privacy Policy</a>.</p>
          </form>
          <div className="signup-login">Already part of Bohemia? <Link href={`/login${returnTo !== DEFAULT_RETURN_TO ? `?redirect=${encodeURIComponent(returnTo)}` : ""}`}>Log in <ArrowRight size={14} aria-hidden="true" /></Link></div>
          <div className="signup-reassurance"><span><LockKeyhole size={13} aria-hidden="true" /> One secure login</span><span><Check size={14} aria-hidden="true" /> Free to create</span></div>
        </section>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="signup-loading" role="status">Loading sign up…</div>}>
      <SignupForm />
    </Suspense>
  );
}
