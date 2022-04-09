import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextRouter } from "next/router";
import { useSignOut } from "../../hooks/useSignOut";
import { Party } from "../../queries/useParty";
import { auth, db } from "../../utils/firebase";
import Button from "../ui/Button.client";
import { MouseEvent } from "react";
import Link from "../ui/Link.client";
import { User } from "firebase/auth";

interface SettingsProps {
  party: Party | undefined;
  router: NextRouter;
  user: User | null | undefined;
}

export const Settings = ({ party, router, user }: SettingsProps) => {
  const signOut = useSignOut(auth);

  const handleExplicitModeToggle = async () => {
    if (user?.phoneNumber !== party?.host) {
      return;
    }

    const document = doc(db, "parties", router.query?.id as string);

    await updateDoc(document, {
      allowsExplicit: !party?.allowsExplicit,
    });
  };

  const handleSignOut = async (e: MouseEvent<Element>) => {
    e.preventDefault();

    if (user?.phoneNumber !== party?.host) {
      signOut();
      return;
    }

    const document = doc(db, "parties", router.query?.id as string);
    await deleteDoc(document);

    const requestsRef = collection(db, "requests");
    const requestQuery = query(
      requestsRef,
      where("party", "==", router.query?.id)
    );
    const snapshot = await getDocs(requestQuery);

    snapshot.forEach(async (d) => {
      const document = doc(db, "requests", d.id);
      await deleteDoc(document);
    });

    signOut();
  };

  return (
    <ul className="mx-auto w-full max-w-xl space-y-4">
      {user?.phoneNumber === party?.host && (
        <li className="flex items-center justify-between gap-2">
          <p className="text-left">toggle explicit mode</p>
          <Button
            theme={party?.allowsExplicit ? "danger" : "positive"}
            onClick={handleExplicitModeToggle}
          >
            {party?.allowsExplicit ? "disable" : "enable"}
          </Button>
        </li>
      )}
      <li className="flex items-center justify-between gap-2">
        <p className="text-left">sign out</p>
        <Link href="/" theme="danger" onClick={handleSignOut}>
          sign out
        </Link>
      </li>
    </ul>
  );
};

export default Settings;
