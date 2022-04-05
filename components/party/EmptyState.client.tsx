import { PlusSmIcon, QrcodeIcon } from "@heroicons/react/outline";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from "../../components/ui/Button.client";
import Link from "../../components/ui/Link.client";
import { auth, db } from "../../utils/firebase";

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

  const handleJoinParty = async () => {};

  return (
    <div className="m-auto text-center">
      <div className="m-auto h-fit w-fit rounded-full bg-sky-700 p-2 text-slate-50 dark:bg-sky-300 dark:text-slate-900">
        {type === "create" && <PlusSmIcon className="h-10 w-10" />}
        {type === "join" && <QrcodeIcon className="h-10 w-10" />}
      </div>
      <h1 className="mt-2 text-2xl font-bold">{type} party</h1>
      <h2 className="mt-2 font-semibold text-slate-500 dark:text-slate-400">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque vitae
        voluptatem dolore corporis
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
      {type === "join" && (
        <Button theme="primary" className="mt-4" onClick={handleJoinParty}>
          join party
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
