import { PlusSmIcon, QrcodeIcon } from "@heroicons/react/outline";
import { addDoc, collection } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "../../components/ui/Link.client";
import { auth, db } from "../../utils/firebase";
import QRCodeModalToggler from "./QRCodeModalToggler.client";

interface EmptyStateProps {
  type: "create" | "join";
}

export const EmptyState = ({ type }: EmptyStateProps) => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const handleCreateParty = async (e: MouseEvent<Element>) => {
    e.preventDefault();

    const doc = await addDoc(collection(db, "parties"), {
      allowsExplicit: true,
      host: user?.phoneNumber,
      createdAt: new Date(),
    });

    router.push(`/party/${doc.id}`);
  };

  return (
    <>
      <Head>
        <title key="title">jockey: start or join a party</title>
      </Head>
      <div className="m-auto text-center">
        <div className="m-auto h-fit w-fit rounded-full bg-sky-700 p-2 text-slate-50 dark:bg-sky-300 dark:text-slate-900">
          {type === "create" && <PlusSmIcon className="h-10 w-10" />}
          {type === "join" && <QrcodeIcon className="h-10 w-10" />}
        </div>
        <h1 className="mt-2 text-2xl font-bold">{type} party</h1>
        <h2 className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
          {type === "create" &&
            "looking to host? create a party for you and your friends and see which songs stand out!"}
          {type === "join" &&
            "your friend already started a party? join them and vote for your favorite songs!"}
        </h2>
        {type === "create" && (
          <Link
            theme="primary"
            className="mt-4"
            href="/party/[id]"
            onClick={handleCreateParty}
          >
            create party
          </Link>
        )}
        {type === "join" && <QRCodeModalToggler />}
      </div>
    </>
  );
};

export default EmptyState;
