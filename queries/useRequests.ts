import {
  collection,
  CollectionReference,
  Firestore,
  FirestoreError,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useParty } from "./useParty";

export interface Request {
  artists: string[];
  explicit: boolean;
  id: string;
  image: string;
  name: string;
  party: string;
  requesters: string[];
}

interface UseRequests {
  requests: Request[] | undefined;
  loading: boolean;
  error: FirestoreError | undefined;
}

export const useRequests = (db: Firestore, id: string): UseRequests => {
  const requestsRef = collection(
    db,
    "requests"
  ) as CollectionReference<Request>;
  const queryRef = query(requestsRef, where("party", "==", id));

  const [queue, loading, error] = useCollectionData(queryRef);
  const { party } = useParty(db, id);

  const queueInterim = queue ? [...queue] : undefined;
  queueInterim?.sort((one, two) => {
    if (one.requesters.length - two.requesters.length !== 0) {
      return two.requesters.length - one.requesters.length;
    }

    if (one.name > two.name) {
      return 1;
    }

    if (one.name < two.name) {
      return -1;
    }

    if (one.artists.join(", ") > two.artists.join(", ")) {
      return 1;
    }

    if (one.artists.join(", ") < two.artists.join(", ")) {
      return -1;
    }

    return 0;
  });

  const requests = queueInterim?.filter(
    (song) => party?.allowsExplicit || !song.explicit
  );

  return {
    requests,
    loading,
    error,
  };
};
