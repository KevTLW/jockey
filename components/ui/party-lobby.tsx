"use client";

import { Tab } from "@headlessui/react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { classNames } from "@/utils/class-names";
import Info from "@/components/party/info";
import Requests from "@/components/party/requests";
import Search from "@/components/party/search";
import Settings from "@/components/party/settings";

interface PartyLobbyProps {
  partyId: string;
}

export default function PartyLobby({ partyId }: PartyLobbyProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [sections] = useState(["info", "requests", "search", "settings"]);

  // Try to parse partyId as a valid Convex ID
  let partyIdParsed: Id<"parties"> | null = null;
  try {
    partyIdParsed = partyId as Id<"parties">;
  } catch {
    partyIdParsed = null;
  }

  const party = useQuery(
    api.parties.get,
    partyIdParsed ? { id: partyIdParsed } : "skip"
  );

  const requests = useQuery(
    api.requests.list,
    partyIdParsed ? { partyId: partyIdParsed } : "skip"
  );

  const currentUserEmail = useQuery(api.parties.getCurrentUserEmail);
  const isHost = currentUserEmail === party?.host;

  // Redirect to party list if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/?party=${partyId}`);
    }
  }, [authLoading, isAuthenticated, router, partyId]);

  // Redirect if party doesn't exist
  useEffect(() => {
    if (party === null) {
      router.push("/party");
    }
  }, [party, router]);

  if (authLoading || party === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !party || !partyIdParsed) {
    return null;
  }

  return (
    <div className="min-h-screen w-full p-2">
      <Tab.Group>
        <Tab.List className="flex space-x-2 overflow-x-auto rounded bg-slate-300/75 p-4 shadow-xl dark:bg-slate-600/75">
          {sections.map((section) => (
            <Tab
              key={section}
              className={({ selected }) =>
                classNames(
                  "rounded border-2 border-sky-700 bg-transparent px-4 py-2 text-center font-bold text-sky-700 shadow-xl shadow-sky-500/25 transition duration-300 focus:outline-none focus:ring focus:ring-sky-700/75 active:bg-sky-800 active:text-slate-50 dark:border-sky-300 dark:text-sky-300 dark:shadow-sky-300/25 dark:focus:ring-sky-300/75 dark:active:bg-sky-400 dark:active:text-slate-900",
                  selected &&
                    "!bg-sky-700 !text-slate-50 dark:!bg-sky-300 dark:!text-slate-900"
                )
              }
            >
              {section}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="p-4 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <Info party={party} partyId={partyIdParsed} />
          </Tab.Panel>
          <Tab.Panel className="p-4 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <Requests
              party={party}
              partyId={partyIdParsed}
              requests={requests || []}
              loading={requests === undefined}
              isHost={isHost}
              currentUserEmail={currentUserEmail}
            />
          </Tab.Panel>
          <Tab.Panel className="p-4 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <Search
              party={party}
              partyId={partyIdParsed}
              requests={requests || []}
              loading={debouncedSearch !== search}
              search={search}
              setSearch={setSearch}
              debouncedSearch={debouncedSearch}
              currentUserEmail={currentUserEmail}
            />
          </Tab.Panel>
          <Tab.Panel className="p-4 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <Settings party={party} partyId={partyIdParsed} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
