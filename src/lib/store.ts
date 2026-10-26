// The storefront's origin. The apex bhmhlth.com is not attached to the store
// (it 404s at Cloudflare); www is. Override per environment with
// NEXT_PUBLIC_STORE_URL.
export const STORE_URL =
  process.env.NEXT_PUBLIC_STORE_URL ?? "https://www.bhmhlth.com";
