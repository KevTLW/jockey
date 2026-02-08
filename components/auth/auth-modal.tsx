"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import AuthForm from "@/components/auth/auth-form";
import Brand from "@/components/ui/brand";
import Button from "@/components/ui/button";

interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  redirectTo?: string;
}

export default function AuthModal({
  isOpen,
  setIsOpen,
  redirectTo,
}: AuthModalProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const { error, resetError, resetVerification } = useAuth();

  const closeModal = () => {
    setIsOpen(false);
    resetError();
    resetVerification();
  };

  return (
    <Transition show={isOpen}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-hidden"
        onClose={closeModal}
      >
        <div className="flex min-h-screen items-center justify-center p-2">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-slate-400 bg-opacity-75 transition-opacity dark:bg-slate-500 dark:bg-opacity-75" />
          </TransitionChild>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <DialogPanel className="relative inline-block w-full max-w-md overflow-hidden rounded bg-slate-50 p-4 align-middle font-mono text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-50 sm:p-8">
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  theme="primary"
                  className="!p-2"
                  onClick={closeModal}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
              <h1 className="mb-2 text-center text-4xl font-bold">
                <Brand
                  accent="text-sky-700 dark:text-sky-300"
                  primary="text-slate-900 dark:text-slate-50"
                />
              </h1>
              {Boolean(error) && (
                <p className="mb-2 mt-4 text-center text-xs font-bold text-rose-700 dark:text-rose-400">
                  {error}
                </p>
              )}

              <h2 className="mb-2 text-2xl font-semibold">sign in</h2>
              <AuthForm
                emailInputRef={emailInputRef}
                otpInputRef={otpInputRef}
                closeModal={closeModal}
                redirectTo={redirectTo}
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
