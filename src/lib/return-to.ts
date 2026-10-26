import { STORE_URL } from "./store";

/**
 * Where to send someone after they log in or sign up. Pages read it from the
 * `redirect` query param (the store sets it to the page the person was on).
 * Only same-site paths and Bohemia origins are honoured, so a crafted link
 * can't bounce people to a stranger's site.
 */
const allowedOrigins = () => {
  const list = [STORE_URL, process.env.NEXT_PUBLIC_ALLOWED_RETURN_ORIGINS ?? ""]
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);
  return new Set(list.map((o) => new URL(o).origin));
};

/** Default landing after signup/login: the store, since there is no profile page yet. */
export const DEFAULT_RETURN_TO = STORE_URL;

export function safeReturnTo(raw: string | null, fallback = DEFAULT_RETURN_TO): string {
  if (!raw) return fallback;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" || url.protocol === "http:") {
      if (allowedOrigins().has(url.origin)) return url.toString();
    }
  } catch {
    /* not a URL */
  }
  return fallback;
}
