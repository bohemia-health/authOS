import { createAuthClient } from "better-auth/react";

// The only place authOS knows where Asclepius lives.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
});
