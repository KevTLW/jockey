"use client";

import { RefObject } from "react";
import { useAuth } from "@/hooks/use-auth";
import EmailVerification from "@/components/auth/email-verification";
import OTPVerification from "@/components/auth/otp-verification";

interface AuthFormProps {
  closeModal: () => void;
  otpInputRef: RefObject<HTMLInputElement | null>;
  emailInputRef: RefObject<HTMLInputElement | null>;
  redirectTo?: string;
}

export default function AuthForm({
  closeModal,
  otpInputRef,
  emailInputRef,
  redirectTo,
}: AuthFormProps) {
  const {
    verifiedEmail,
    sendOTP,
    verifyOTP,
    resendOTP,
    resetVerification,
    resetError,
    isSubmitting,
  } = useAuth();

  if (verifiedEmail === "") {
    return (
      <EmailVerification
        sendOTP={sendOTP}
        closeModal={closeModal}
        resetError={resetError}
        isSubmitting={isSubmitting}
        ref={emailInputRef}
      />
    );
  } else {
    return (
      <OTPVerification
        verifyOTP={verifyOTP}
        resendOTP={resendOTP}
        resetVerification={resetVerification}
        resetError={resetError}
        isSubmitting={isSubmitting}
        redirectTo={redirectTo}
        closeModal={closeModal}
        ref={otpInputRef}
      />
    );
  }
}
