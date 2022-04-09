import { User } from "firebase/auth";
import { NextRouter } from "next/router";
import { Flipper } from "react-flip-toolkit";
import { Party } from "../../queries/useParty";
import { Request } from "../../queries/useRequests";
import LoadingSong from "./LoadingSong.client";
import Song from "./Song.client";

interface RequestsProps {
  party: Party | undefined;
  requests: Request[] | undefined;
  loading: boolean;
  router: NextRouter;
  user: User | null | undefined;
}

export const Requests = ({
  party,
  requests,
  loading,
  router,
  user,
}: RequestsProps) => {
  if (loading) {
    return <LoadingSong amount={3} />;
  }

  if (requests?.length === 0) {
    return (
      <h1 className="font-semibold text-slate-500 dark:text-slate-400">
        make requests on the search tab
      </h1>
    );
  }

  return (
    <Flipper flipKey={requests?.map((request) => request.id).join()}>
      <ul className="mx-auto w-full max-w-xl space-y-4">
        {requests?.map((request) => (
          <Song
            party={party}
            request={request}
            type="request"
            user={user}
            key={request.id}
            requests={requests}
            router={router}
          />
        ))}
      </ul>
    </Flipper>
  );
};

export default Requests;
