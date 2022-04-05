import { User } from "firebase/auth";
import { NextRouter } from "next/router";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Party } from "../../queries/useParty";
import { Request } from "../../queries/useRequests";
import LoadingSong from "./LoadingSong.client";
import Song from "./Song.client";

interface SearchProps {
  party: Party | undefined;
  requests: Request[] | undefined;
  loading: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  results: Request[] | undefined;
  router: NextRouter;
  user: User | null | undefined;
}

export const Search = ({
  party,
  requests,
  loading,
  search,
  setSearch,
  results,
  router,
  user,
}: SearchProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        className="mx-auto  block w-full max-w-xs rounded bg-slate-300/75 p-2 text-slate-900 shadow-xl outline-none transition duration-300 focus:ring focus:ring-sky-700/75 dark:bg-slate-600/75 dark:text-slate-50 dark:focus:ring-sky-300/75"
        onChange={handleChange}
        value={search}
        placeholder="search artists or songs"
      />

      {loading ? (
        <LoadingSong className="mt-4" amount={3} />
      ) : (
        <ul className="mx-auto mt-4 w-full max-w-xl space-y-4">
          {results?.length === 0 && (
            <h1 className="font-semibold text-slate-500 dark:text-slate-400">
              no songs matched this query
            </h1>
          )}
          {results?.map((result) => (
            <Song
              key={result.id}
              party={party}
              request={result}
              requests={requests}
              type="search"
              user={user}
              router={router}
            />
          ))}
        </ul>
      )}
    </>
  );
};
export default Search;
