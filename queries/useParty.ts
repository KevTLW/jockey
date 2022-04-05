import {
  doc,
  DocumentReference,
  Firestore,
  FirestoreError,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

export interface Party {
  allowsExplicit: boolean;
  createdAt: Date;
  host: string;
}

export interface UseParty {
  party: Party | undefined;
  loading: boolean;
  error: FirestoreError | undefined;
}

export const useParty = (db: Firestore, id: string): UseParty => {
  const partyRef = doc(db, "parties", id) as DocumentReference<Party>;
  const [party, loading, error] = useDocumentData(partyRef);

  return {
    party,
    loading,
    error,
  };
};
