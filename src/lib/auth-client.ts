import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// The only place authOS knows where Asclepius lives.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
  plugins: [
    // Mirrors user.additionalFields in asclepius-api/src/auth.ts so
    // signUp.email is typed for them.
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true },
        birthDate: { type: "date", required: true },
      },
    }),
  ],
});
