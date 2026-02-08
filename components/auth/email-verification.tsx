"use client";

import { forwardRef, useState } from "react";
import Button from "@/components/ui/button";

interface EmailVerificationProps {
  closeModal: () => void;
  sendOTP: (email: string) => Promise<boolean>;
  resetError: () => void;
  isSubmitting: boolean;
}

const EmailVerification = forwardRef<HTMLInputElement, EmailVerificationProps>(
  ({ closeModal, sendOTP, resetError, isSubmitting }, emailInputRef) => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await sendOTP(email);
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <div className="col-span-12">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              enter email address
            </label>
            <input
              className="block w-full rounded-md bg-slate-300/75 p-2 shadow-xl outline-none transition duration-300 invalid:bg-red-400 focus:ring focus:ring-sky-700/75 dark:bg-slate-600/75 dark:focus:ring-sky-300/75"
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyUp={resetError}
              ref={emailInputRef}
            />
          </div>
        </div>

        <div className="flex">
          <Button
            type="button"
            theme="danger"
            className="w-full"
            onClick={closeModal}
          >
            cancel
          </Button>
          <Button
            type="submit"
            theme="primary"
            className="ml-2 w-full"
            disabled={isSubmitting || !email.trim()}
          >
            {isSubmitting ? "sending..." : "submit"}
          </Button>
        </div>
      </form>
    );
  }
);

EmailVerification.displayName = "EmailVerification";

export default EmailVerification;
