"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Brand from "@/components/ui/brand";
import Button from "@/components/ui/button";

interface QRCodeModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function QRCodeModal({ isOpen, setIsOpen }: QRCodeModalProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>("");
  const [partyCode, setPartyCode] = useState("");

  const closeModal = () => {
    setIsOpen(false);
    setError("");
    setPartyCode("");
  };

  const handleManualJoin = () => {
    if (partyCode.trim()) {
      router.push(`/party/${partyCode.trim()}`);
      closeModal();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied. Enter party code manually below.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

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
              <h1 className="text-center text-4xl font-bold">
                <Brand
                  accent="text-sky-700 dark:text-sky-300"
                  primary="text-slate-900 dark:text-slate-50"
                />
              </h1>
              <h2 className="mt-4 text-2xl font-semibold">join party</h2>

              {error ? (
                <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">
                  {error}
                </p>
              ) : (
                <div className="mt-4 overflow-hidden rounded">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}

              <div className="mt-4">
                <label
                  htmlFor="partyCode"
                  className="mb-2 block text-sm font-medium"
                >
                  or enter party code manually
                </label>
                <input
                  type="text"
                  id="partyCode"
                  className="block w-full rounded-md bg-slate-300/75 p-2 shadow-xl outline-none transition duration-300 focus:ring focus:ring-sky-700/75 dark:bg-slate-600/75 dark:focus:ring-sky-300/75"
                  value={partyCode}
                  onChange={(e) => setPartyCode(e.target.value)}
                  placeholder="Enter party ID"
                />
                <Button
                  theme="primary"
                  className="mt-2 w-full"
                  onClick={handleManualJoin}
                  disabled={!partyCode.trim()}
                >
                  join
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
