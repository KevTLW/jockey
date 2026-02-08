"use client";

import { PlusSmallIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { api } from "@/convex/_generated/api";
import Link from "@/components/ui/link";
import QRCodeModalToggler from "@/components/party/qr-code-modal-toggler";

interface EmptyStateProps {
  type: "create" | "join";
}

export default function EmptyState({ type }: EmptyStateProps) {
  const router = useRouter();
  const createParty = useMutation(api.parties.create);

  const handleCreateParty = async (e: MouseEvent<Element>) => {
    e.preventDefault();

    try {
      const partyId = await createParty({ allowsExplicit: true });
      router.push(`/party/${partyId}`);
    } catch (error) {
      console.error("Failed to create party:", error);
    }
  };

  return (
    <div className="m-auto text-center">
      <div className="m-auto h-fit w-fit rounded-full bg-sky-700 p-2 text-slate-50 dark:bg-sky-300 dark:text-slate-900">
        {type === "create" && <PlusSmallIcon className="h-10 w-10" />}
        {type === "join" && <QrCodeIcon className="h-10 w-10" />}
      </div>
      <h1 className="mt-2 text-2xl font-bold">{type} party</h1>
      <h2 className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
        {type === "create" &&
          "looking to host? create a party for you and your friends and see which songs stand out!"}
        {type === "join" &&
          "your friend already started a party? join them and vote for your favorite songs!"}
      </h2>
      {type === "create" && (
        <Link
          theme="primary"
          className="mt-4"
          href="/party/new"
          onClick={handleCreateParty}
        >
          create party
        </Link>
      )}
      {type === "join" && <QRCodeModalToggler />}
    </div>
  );
}
