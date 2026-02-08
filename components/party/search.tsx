"use client";

import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import LoadingSong from "@/components/party/loading-song";
import Song from "@/components/party/song";

interface SearchResult {
  spotifyId: string;
  name: string;
  artists: string[];
  image: string;
  explicit: boolean;
  previewUrl: string | null;
}

interface SearchProps {
  party: Doc<"parties">;
  partyId: Id<"parties">;
  requests: Doc<"requests">[];
  loading: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  debouncedSearch: string;
  currentUserEmail?: string | null;
}

export default function Search({
  party,
  partyId,
  requests,
  loading,
  search,
  setSearch,
  debouncedSearch,
  currentUserEmail,
}: SearchProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchSpotify = useAction(api.spotify.search);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const searchResults = await searchSpotify({ query: debouncedSearch });
        setResults(searchResults);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearch, searchSpotify]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filter out explicit songs if party doesn't allow them
  const filteredResults = party.allowsExplicit
    ? results
    : results.filter((result) => !result.explicit);

  return (
    <>
      <input
        type="text"
        className="mx-auto block w-full max-w-xs rounded bg-slate-300/75 p-2 text-slate-900 shadow-xl outline-none transition duration-300 focus:ring focus:ring-sky-700/75 dark:bg-slate-600/75 dark:text-slate-50 dark:focus:ring-sky-300/75"
        onChange={handleChange}
        value={search}
        placeholder="search artists or songs"
      />

      {loading || isSearching ? (
        <LoadingSong className="mt-4" amount={3} />
      ) : (
        <ul className="mx-auto mt-4 w-full max-w-xl space-y-4">
          {filteredResults.length === 0 && debouncedSearch.trim() && (
            <h1 className="font-semibold text-slate-500 dark:text-slate-400">
              no songs matched this query
            </h1>
          )}
          {filteredResults.map((result) => (
            <Song
              key={result.spotifyId}
              party={party}
              partyId={partyId}
              request={{
                _id: result.spotifyId as any,
                _creationTime: 0,
                partyId,
                spotifyId: result.spotifyId,
                name: result.name,
                artists: result.artists,
                image: result.image,
                explicit: result.explicit,
                previewUrl: result.previewUrl,
                requesters: [],
              }}
              type="search"
              requests={requests}
              currentUserEmail={currentUserEmail}
            />
          ))}
        </ul>
      )}
    </>
  );
}
