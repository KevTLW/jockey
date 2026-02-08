"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import LoadingSong from "@/components/party/loading-song";
import Song from "@/components/party/song";

interface RequestsProps {
  party: Doc<"parties">;
  partyId: Id<"parties">;
  requests: Doc<"requests">[];
  loading: boolean;
  isHost: boolean;
  currentUserEmail?: string | null;
}

export default function Requests({
  party,
  partyId,
  requests,
  loading,
  isHost,
  currentUserEmail,
}: RequestsProps) {
  const [requestsParent] = useAutoAnimate<HTMLUListElement>({
    duration: 300,
    easing: "ease-in-out",
  });

  if (loading) {
    return <LoadingSong amount={3} />;
  }

  if (requests.length === 0) {
    return (
      <h1 className="font-semibold text-slate-500 dark:text-slate-400">
        make requests on the search tab
      </h1>
    );
  }

  return (
    <ul className="mx-auto w-full max-w-xl space-y-4" ref={requestsParent}>
      {requests.map((request) => (
        <Song
          key={request._id}
          party={party}
          partyId={partyId}
          request={request}
          type="request"
          requests={requests}
          isHost={isHost}
          currentUserEmail={currentUserEmail}
        />
      ))}
    </ul>
  );
}
