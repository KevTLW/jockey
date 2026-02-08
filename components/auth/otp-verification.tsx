"use client";

import { forwardRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

interface OTPVerificationProps {
  verifyOTP: (code: string) => Promise<boolean>;
  resendOTP: () => Promise<void>;
  resetVerification: () => void;
  resetError: () => void;
  isSubmitting: boolean;
  redirectTo?: string;
  closeModal?: () => void;
}

const OTPVerification = forwardRef<HTMLInputElement, OTPVerificationProps>(
  (
    {
      verifyOTP,
      resendOTP,
      resetVerification,
      resetError,
      isSubmitting,
      redirectTo,
      closeModal,
    },
    otpInputRef
  ) => {
    const router = useRouter();
    const [code, setCode] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const success = await verifyOTP(code);
      if (success) {
        closeModal?.();
        setTimeout(() => {
          router.refresh();
          router.push(redirectTo || "/party");
        }, 100);
      }
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="col-span-12">
            <label htmlFor="code" className="mb-2 block text-sm font-medium">
              enter one time pin
            </label>
            <input
              className="block w-full rounded-md bg-slate-300/75 p-2 shadow-xl outline-none transition duration-300 focus:ring focus:ring-sky-700/75 dark:bg-slate-600/75 dark:focus:ring-sky-300/75"
              type="text"
              id="code"
              name="code"
              autoComplete="one-time-code"
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyUp={resetError}
              ref={otpInputRef}
            />
          </div>
        </div>

        <div className="flex">
          <Button
            type="button"
            theme="danger"
            className="w-full"
            onClick={resetVerification}
          >
            back
          </Button>
          <Button
            type="button"
            theme="special"
            className="ml-2 w-full"
            onClick={resendOTP}
            disabled={isSubmitting}
          >
            retry
          </Button>
          <Button
            type="submit"
            theme="positive"
            className="ml-2 w-full"
            disabled={isSubmitting || !code.trim()}
          >
            {isSubmitting ? "verifying..." : "submit"}
          </Button>
        </div>
      </form>
    );
  }
);

OTPVerification.displayName = "OTPVerification";

export default OTPVerification;
