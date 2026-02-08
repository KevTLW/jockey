"use client";

import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  TrashIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { useMutation } from "convex/react";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Button from "@/components/ui/button";

interface SongProps {
  request: Doc<"requests">;
  party: Doc<"parties">;
  partyId: Id<"parties">;
  type: "request" | "search";
  requests: Doc<"requests">[];
  isHost?: boolean;
  currentUserEmail?: string | null;
}

export default function Song({
  request,
  party,
  partyId,
  type,
  requests,
  isHost = false,
  currentUserEmail,
}: SongProps) {
  const addRequest = useMutation(api.requests.addRequest);
  const removeRequest = useMutation(api.requests.removeRequest);
  const deleteRequest = useMutation(api.requests.deleteRequest);

  const existingRequest = requests.find(
    (r) => r.spotifyId === request.spotifyId
  );
  const requesterCount = existingRequest?.requesters.length || 0;
  const userHasLiked =
    currentUserEmail && existingRequest?.requesters.includes(currentUserEmail);

  const handleRequesting = async () => {
    try {
      await addRequest({
        partyId,
        spotifyId: request.spotifyId,
        name: request.name,
        artists: request.artists,
        image: request.image,
        explicit: request.explicit,
        previewUrl: request.previewUrl,
      });
    } catch {
      // Request failed silently
    }
  };

  const handleUnrequesting = async () => {
    try {
      await removeRequest({
        partyId,
        spotifyId: request.spotifyId,
      });
    } catch {
      // Request failed silently
    }
  };

  const handleRemovingRequest = async () => {
    try {
      await deleteRequest({
        partyId,
        spotifyId: request.spotifyId,
      });
    } catch {
      // Request failed silently
    }
  };

  return (
    <li className="gap-2 rounded bg-sky-900 p-4 text-slate-50 shadow-xl shadow-sky-500/25 dark:bg-slate-50 dark:text-slate-900 dark:shadow-sky-300/25 sm:grid sm:grid-cols-[120px_auto_150px] sm:p-0">
      <Image
        src={request.image}
        width={200}
        height={200}
        alt=""
        className="rounded sm:rounded-r-none"
      />

      <div className="flex flex-col justify-center overflow-hidden text-center sm:text-left">
        {request.explicit && (
          <p className="mx-auto w-fit rounded bg-slate-800 p-1 text-xs font-semibold dark:bg-slate-200 sm:mx-0">
            explicit
          </p>
        )}
        <h2 className="mt-1 truncate text-2xl font-bold text-sky-300 dark:text-sky-700">
          {request.name}
        </h2>
        <h3 className="truncate text-lg font-semibold">
          {request.artists.join(", ")}
        </h3>
      </div>

      <div
        className={`flex flex-col justify-center ${type === "request" ? "pr-3" : ""}`}
      >
        <h4 className="font-semibold">
          <span className="text-sky-300 dark:text-sky-700">
            {requesterCount}
          </span>{" "}
          {requesterCount === 1 ? "request" : "requests"}
        </h4>

        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
          {!userHasLiked && (
            <Button
              theme="positive-inverse"
              className="!p-1.5 flex items-center justify-center"
              onClick={handleRequesting}
            >
              <HandThumbUpIcon className="h-4 w-4" />
            </Button>
          )}

          {userHasLiked && (
            <Button
              theme="danger-inverse"
              className="!p-1.5 flex items-center justify-center"
              onClick={handleUnrequesting}
            >
              <HandThumbDownIcon className="h-4 w-4" />
            </Button>
          )}

          <a
            href={`https://open.spotify.com/track/${request.spotifyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded border-2 border-emerald-300 bg-transparent p-1.5 text-emerald-300 shadow-xl shadow-emerald-300/25 transition duration-300 hover:bg-emerald-300 hover:text-slate-900 focus:outline-none focus:ring focus:ring-emerald-300/75 dark:border-emerald-700 dark:text-emerald-700 dark:shadow-emerald-500/25 dark:hover:bg-emerald-700 dark:hover:text-slate-50 dark:focus:ring-emerald-700/75"
          >
            <MusicalNoteIcon className="h-4 w-4" />
          </a>

          {type === "request" && isHost && (
            <Button
              theme="danger-inverse"
              className="!p-1.5 flex items-center justify-center"
              onClick={handleRemovingRequest}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
