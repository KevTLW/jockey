"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export function useAuth() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const router = useRouter();

  const [error, setError] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendOTP = useCallback(
    async (email: string) => {
      setIsSubmitting(true);
      setError("");

      try {
        const normalizedEmail = email.trim().toLowerCase();

        await signIn("resend-otp", {
          email: normalizedEmail,
        });

        setVerifiedEmail(normalizedEmail);
        return true;
      } catch {
        setError("Failed to send verification code. Please try again.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [signIn]
  );

  const verifyOTP = useCallback(
    async (code: string) => {
      setIsSubmitting(true);
      setError("");

      try {
        await signIn("resend-otp", {
          email: verifiedEmail,
          code,
        });

        return true;
      } catch {
        setError("Invalid verification code. Please try again.");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [signIn, verifiedEmail]
  );

  const resendOTP = useCallback(async () => {
    if (verifiedEmail) {
      await sendOTP(verifiedEmail);
    }
  }, [verifiedEmail, sendOTP]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push("/");
  }, [signOut, router]);

  const resetVerification = useCallback(() => {
    setVerifiedEmail("");
    setError("");
  }, []);

  const resetError = useCallback(() => {
    setError("");
  }, []);

  return {
    isAuthenticated,
    isLoading,
    error,
    verifiedEmail,
    isSubmitting,
    sendOTP,
    verifyOTP,
    resendOTP,
    signOut: handleSignOut,
    resetVerification,
    resetError,
  };
}
