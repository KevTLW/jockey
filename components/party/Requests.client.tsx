import { useAutoAnimate } from "@formkit/auto-animate/react";
import { User } from "firebase/auth";
import { NextRouter } from "next/router";
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
  const [requestsParent] = useAutoAnimate<HTMLUListElement>({
    duration: 300,
    easing: "ease-in-out",
  });

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
    <ul className="mx-auto w-full max-w-xl space-y-4" ref={requestsParent}>
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
  );
};

export default Requests;
