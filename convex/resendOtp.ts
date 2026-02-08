import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend } from "resend";

export const ResendOTP = Email({
  id: "resend-otp",

  async generateVerificationToken() {
    return generateRandomString(6, alphabet("0-9"));
  },

  async sendVerificationRequest({ identifier: email, token }) {
    const skipEmail =
      !process.env.RESEND_FROM_EMAIL ||
      process.env.RESEND_FROM_EMAIL.includes("resend.dev");
    if (skipEmail) {
      console.log(`[DEV] OTP for ${email}: ${token}`);
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Jockey <noreply@resend.dev>",
      to: [email],
      subject: "Your Jockey verification code",
      html: `
        <div style="font-family: monospace; padding: 20px;">
          <h1 style="color: #0369a1;">jockey</h1>
          <p>Your verification code is:</p>
          <h2 style="font-size: 32px; letter-spacing: 4px; color: #0369a1;">${token}</h2>
          <p>This code expires in 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      throw new Error("Failed to send verification code");
    }
  },
});
