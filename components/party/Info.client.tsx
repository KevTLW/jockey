import { Transition } from "@headlessui/react";
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
import { Fragment, MouseEvent, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Party } from "../../queries/useParty";
import { db } from "../../utils/firebase";
import Button from "../ui/Button.client";
import Link from "../ui/Link.client";

interface InfoProps {
  party: Party | undefined;
  router: NextRouter;
  user: User | null | undefined;
}

export const Info = ({ party, router, user }: InfoProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleTooltipClick = () => {
    setIsTooltipOpen(true);
    navigator.clipboard.writeText(window.location.href);
  };

  useEffect(() => {
    setTimeout(() => setIsTooltipOpen(false), 1000);
  }, [isTooltipOpen]);

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
        <QRCode
          className="text-center"
          size={200}
          value={window.location.href}
        />
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-50  md:text-3xl">
        {router.query?.id}
      </h2>
      <div className="mt-4 space-x-2">
        <div className="relative inline-block">
          <Button theme="primary" onClick={handleTooltipClick}>
            share party
          </Button>
          <Transition
            as={Fragment}
            show={isTooltipOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="absolute left-1/2 z-10 mt-2 -translate-x-1/2 transform overflow-hidden rounded bg-sky-900 px-4 py-2 text-slate-50 shadow-xl shadow-sky-500/25 dark:bg-slate-50 dark:text-slate-900 dark:shadow-sky-300/25">
              copied!
            </div>
          </Transition>
        </div>

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
