import { Tab } from "@headlessui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDebounce } from "use-debounce";
import { useParty } from "../../queries/useParty";
import { useRequests } from "../../queries/useRequests";
import { useSpotifySearch } from "../../queries/useSpotifySearch";
import { classNames } from "../../utils/classNames";
import { auth, db } from "../../utils/firebase";
import Info from "../party/Info.client";
import Requests from "../party/Requests.client";
import Search from "../party/Search.client";
import Settings from "../party/Settings.client";

export const PartyLobby = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [sections] = useState(["info", "requests", "search", "settings"]);
  const { party, loading: partyLoading } = useParty(
    db,
    router.query?.id as string
  );
  const { data: searchResults, loading: searchLoading } =
    useSpotifySearch(debouncedSearch);
  const { requests, loading: requestsLoading } = useRequests(
    db,
    router.query?.id as string
  );

  if (!partyLoading && party === undefined) {
    router.push("/party");
  }

  return (
    <>
      <Head>
        <title key="title">jockey: party lobby</title>
      </Head>
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
              <Info party={party} router={router} user={user} />
            </Tab.Panel>
            <Tab.Panel className="p-4 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
              <Requests
                party={party}
                requests={requests}
                loading={requestsLoading}
                user={user}
                router={router}
              />
            </Tab.Panel>
            <Tab.Panel className="p-4 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
              <Search
                party={party}
                requests={requests}
                loading={debouncedSearch !== search || searchLoading}
                search={search}
                setSearch={setSearch}
                results={searchResults}
                router={router}
                user={user}
              />
            </Tab.Panel>
            <Tab.Panel className="p-4 text-center ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
              <Settings party={party} router={router} user={user} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default PartyLobby;
