import {
  collection,
  CollectionReference,
  Firestore,
  FirestoreError,
  query,
  where,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

interface Request {
  artists: string[];
  id: string;
  image: string;
  name: string;
  party: string;
  requester: string;
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

  const [requests, loading, error] = useCollectionData(queryRef);

  return {
    requests,
    loading,
    error,
  };
};
