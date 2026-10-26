"use client";

import { Turnstile } from "@marsidev/react-turnstile";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** True when a Turnstile site key is configured. Without one the widget is
 *  absent and Asclepius skips the check too. */
export const CAPTCHA_ENABLED = Boolean(siteKey);

/** Invisible-by-default Cloudflare Turnstile widget. Hands the token up as
 *  soon as the challenge passes; clears it when the token expires. */
export function Captcha({ onToken }: { onToken: (token: string) => void }) {
  if (!siteKey) return null;
  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={() => onToken("")}
      onError={() => onToken("")}
      options={{ size: "flexible", appearance: "interaction-only" }}
    />
  );
}

/** Fetch options that carry the token to Asclepius, or nothing when off. */
export function captchaHeaders(token: string) {
  return token ? { headers: { "x-captcha-response": token } } : {};
}
