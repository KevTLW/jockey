import { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextRouter } from "next/router";
import QRCode from "react-qr-code";
import { Party } from "../../queries/useParty";
import { db } from "../../utils/firebase";
import Button from "../ui/Button.client";
import Link from "../ui/Link.client";
import { MouseEvent } from "react";

interface InfoProps {
  party: Party | undefined;
  router: NextRouter;
  user: User | null | undefined;
}

export const Info = ({ party, router, user }: InfoProps) => {
  const handleEndParty = async (e: MouseEvent<Element>) => {
    e.preventDefault();

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

    router.push("/party");
  };

  return (
    <>
      <div className="inline-block rounded bg-slate-900 p-4 dark:bg-slate-50">
        <QRCode className="text-center" value={window.location.href} />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-50  md:text-3xl">
        {router.query?.id}
      </h2>
      <div className="mt-4 space-x-2">
        <Button theme="primary">share party</Button>

        {party?.host === user?.phoneNumber ? (
          <Link href="/party" onClick={handleEndParty} theme="danger">
            end party
          </Link>
        ) : (
          <Link href="/party" theme="danger">
            leave party
          </Link>
        )}
      </div>
    </>
  );
};

export default Info;
