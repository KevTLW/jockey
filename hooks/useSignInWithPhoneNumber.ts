import {
  Auth,
  AuthError,
  ConfirmationResult,
  RecaptchaParameters,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  User,
} from "firebase/auth";
import { useAtom } from "jotai";
import nookies from "nookies";
import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth_errorAtom, auth_verifiedNumberAtom } from "../state/atoms";

export interface UseSignInWithPhoneNumber {
  user: User | null | undefined;
  loading: boolean;
  error: string;
  verifiedNumber: string;
  signIn: (number: string, isResent?: boolean) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  resendOTP: () => Promise<void>;
  resetError: () => void;
  resetVerification: () => void;
}

export const useSignInWithPhoneNumber = (
  auth: Auth,
  id: string,
  parameters: RecaptchaParameters
): UseSignInWithPhoneNumber => {
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const confirmationResult = useRef<ConfirmationResult | null>(null);
  const [error, setError] = useAtom(auth_errorAtom);
  const [verifiedNumber, setVerifiedNumber] = useAtom(auth_verifiedNumberAtom);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    recaptchaVerifier.current = new RecaptchaVerifier(id, parameters, auth);

    return () => {
      recaptchaVerifier.current?.clear();
    };
  }, [auth, id, parameters]);

  const isAuthError = (error: any): error is AuthError => {
    return (
      typeof error.code === "string" &&
      typeof error.message === "string" &&
      typeof error.name === "string"
    );
  };

  const handleAuthErrorCode = (error: string) => {
    if (error === "auth/invalid-phone-number") {
      setError("phone number is invalid");
    } else if (error === "auth/invalid-verification-code") {
      setError("one time password is invalid");
    } else if (error === "auth/too-many-requests") {
      setError("please try again later");
    }
  };

  const signIn = async (number: string, isResent: boolean = false) => {
    try {
      confirmationResult.current = await signInWithPhoneNumber(
        auth,
        number,
        recaptchaVerifier.current as RecaptchaVerifier
      );

      setVerifiedNumber(number);
      if (!isResent) {
        setError("");
      }

      return true;
    } catch (error) {
      console.error(error);

      if (isAuthError(error)) {
        setVerifiedNumber("");
        handleAuthErrorCode(error.code);

        const widgetId = await recaptchaVerifier.current?.render();
        grecaptcha.reset(widgetId);
      }

      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      const result = await confirmationResult.current?.confirm(otp);
      const user = result?.user;
      const token = await user?.getIdToken();

      if (token) {
        nookies.set(undefined, "token", token, { path: "/" });
        setError("");
      }

      return true;
    } catch (error) {
      console.error(error);

      if (isAuthError(error)) {
        handleAuthErrorCode(error.code);
      }

      return false;
    }
  };

  const resendOTP = async () => {
    signIn(verifiedNumber, true);
  };

  const resetError = () => {
    setError("");
  };

  const resetVerification = () => {
    setVerifiedNumber("");
    setError("");
  };

  return {
    user,
    loading,
    error,
    verifiedNumber,
    signIn,
    verifyOTP,
    resendOTP,
    resetError,
    resetVerification,
  };
};
