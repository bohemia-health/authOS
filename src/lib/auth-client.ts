import { createAuthClient } from "better-auth/react";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";

// The only place authOS knows where Asclepius lives.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
  plugins: [
    // When a page URL carries an OAuth request (another app sent the person
    // here to log in), this attaches it to sign-in/sign-up/consent calls so
    // Asclepius can resume that flow afterwards.
    oauthProviderClient(),
    // Email verification is by 6-digit code (Asclepius's emailOTP plugin);
    // gives authClient.emailOtp.verifyEmail / sendVerificationOtp.
    emailOTPClient(),
    // Mirrors user.additionalFields in asclepius-api/src/auth.ts so
    // signUp.email is typed for them.
    inferAdditionalFields({
      user: {
        firstName: { type: "string", required: true },
        lastName: { type: "string", required: true },
        birthDate: { type: "date", required: true },
        marketingOptIn: { type: "boolean", required: false },
      },
    }),
  ],
});
