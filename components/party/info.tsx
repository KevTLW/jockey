"use client";

import { Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Fragment, MouseEvent, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Doc } from "@/convex/_generated/dataModel";
import Button from "@/components/ui/button";
import Link from "@/components/ui/link";

interface InfoProps {
  party: Doc<"parties">;
  partyId: Id<"parties">;
}

export default function Info({ party, partyId }: InfoProps) {
  const router = useRouter();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const deleteParty = useMutation(api.parties.deleteParty);
  const currentUserEmail = useQuery(api.parties.getCurrentUserEmail);

  const isHost = currentUserEmail === party.host;

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleTooltipClick = () => {
    setIsTooltipOpen(true);
    navigator.clipboard.writeText(currentUrl);
  };

  useEffect(() => {
    if (isTooltipOpen) {
      const timeout = setTimeout(() => setIsTooltipOpen(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isTooltipOpen]);

  const handleEndParty = async (e: MouseEvent<Element>) => {
    e.preventDefault();

    try {
      await deleteParty({ id: partyId });
      router.push("/party");
    } catch (error) {
      console.error("Failed to end party:", error);
    }
  };

  return (
    <>
      <div className="inline-block rounded bg-slate-900 p-4 dark:bg-slate-50">
        {currentUrl && (
          <QRCode className="text-center" size={200} value={currentUrl} />
        )}
      </div>
      <h2 className="mt-4 break-all text-xl font-bold text-slate-900 dark:text-slate-50 md:text-3xl">
        {partyId}
      </h2>
      <div className="mt-4 space-x-2">
        <div className="relative inline-block">
          <Button theme="primary" onClick={handleTooltipClick}>
            share party
          </Button>
          <Transition
            as={Fragment}
            show={isTooltipOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="absolute left-1/2 z-10 mt-2 -translate-x-1/2 transform overflow-hidden rounded bg-sky-900 px-4 py-2 text-slate-50 shadow-xl shadow-sky-500/25 dark:bg-slate-50 dark:text-slate-900 dark:shadow-sky-300/25">
              copied!
            </div>
          </Transition>
        </div>

        {isHost && (
          <Link href="/party" onClick={handleEndParty} theme="danger">
            end party
          </Link>
        )}
      </div>
    </>
  );
}
