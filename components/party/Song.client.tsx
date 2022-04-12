import {
  BanIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { NextRouter } from "next/router";
import { Flipped } from "react-flip-toolkit";
import { Party } from "../../queries/useParty";
import { Request } from "../../queries/useRequests";
import { db } from "../../utils/firebase";
import Button from "../ui/Button.client";
import AudioPlayer from "./AudioPlayer.client";

interface SongProps {
  request: Request;
  party: Party | undefined;
  type: "request" | "search";
  requests: Request[] | undefined;
  router: NextRouter;
  user: User | null | undefined;
}

export const Song = ({
  request,
  party,
  type,
  requests,
  router,
  user,
}: SongProps) => {
  const handleRequesting = async (request: Request) => {
    const requestsRef = collection(db, "requests");
    const requestQuery = query(
      requestsRef,
      where("party", "==", router.query?.id),
      where("id", "==", request.id)
    );
    const snapshot = await getDocs(requestQuery);

    if (snapshot.empty) {
      const document = {
        artists: request.artists,
        explicit: request.explicit,
        id: request.id,
        image: request.image,
        name: request.name,
        party: router.query?.id,
        preview_url: request.preview_url,
        requesters: [user?.phoneNumber],
      };

      await addDoc(collection(db, "requests"), document);
    } else {
      const requesters = snapshot.docs[0].data().requesters;
      if (requesters.includes(user?.phoneNumber)) {
        return;
      }

      const newRequesters = [...requesters, user?.phoneNumber];
      const document = doc(db, "requests", snapshot.docs[0].id);
      await updateDoc(document, {
        requesters: newRequesters,
      });
    }
  };

  const handleUnrequesting = async (request: Request) => {
    const requestsRef = collection(db, "requests");
    const requestQuery = query(
      requestsRef,
      where("party", "==", router.query?.id),
      where("id", "==", request.id)
    );
    const snapshot = await getDocs(requestQuery);

    const requesters = snapshot.docs[0].data().requesters;
    if (!requesters.includes(user?.phoneNumber)) {
      return;
    }

    const document = doc(db, "requests", snapshot.docs[0].id);
    if (requesters.length === 1) {
      await deleteDoc(document);
    } else {
      const newRequesters = [...requesters].filter(
        (requester) => requester !== user?.phoneNumber
      );
      await updateDoc(document, {
        requesters: newRequesters,
      });
    }
  };

  const handleRemovingRequest = async (request: Request) => {
    if (party?.host !== user?.phoneNumber) {
      return;
    }

    const requestsRef = collection(db, "requests");
    const requestQuery = query(requestsRef, where("id", "==", request.id));
    const snapshot = await getDocs(requestQuery);

    const document = doc(db, "requests", snapshot.docs[0].id);
    await deleteDoc(document);
  };

  return (
    <Flipped flipId={request.id}>
      <li className="gap-2 rounded bg-sky-900 p-4 text-slate-50 shadow-xl shadow-sky-500/25 dark:bg-slate-50 dark:text-slate-900 dark:shadow-sky-300/25 sm:grid sm:grid-cols-[120px_auto_150px] sm:p-0">
        <Image
          src={request.image}
          width={200}
          height={200}
          alt=""
          className="rounded sm:rounded-r-none"
        />

        <div className="flex flex-col justify-center overflow-hidden text-center sm:text-left">
          {request.explicit && (
            <p className="mx-auto w-fit rounded bg-slate-800 p-1 text-xs font-semibold dark:bg-slate-200 sm:mx-0">
              explicit
            </p>
          )}
          <h2 className="mt-1 truncate text-2xl font-bold text-sky-300 dark:text-sky-700">
            {request.name}
          </h2>
          <h3 className="truncate text-lg font-semibold">
            {request.artists.join(", ")}
          </h3>
        </div>

        <div className="flex flex-col justify-center">
          <h4 className="font-semibold">
            <span className="text-sky-300 dark:text-sky-700">
              {type === "search"
                ? requests?.find((r) => r.id === request.id)?.requesters
                    .length || 0
                : request.requesters.length}
            </span>

            {type === "search" &&
              (requests?.find((r) => r.id === request.id)?.requesters.length ===
              1
                ? " request"
                : " requests")}

            {type === "request" &&
              (request.requesters.length === 1 ? " request" : " requests")}
          </h4>
          <div className="space-x-2">
            {type === "search" &&
              (requests
                ?.find((r) => r.id === request.id)
                ?.requesters.includes(user?.phoneNumber ?? "") ? (
                <Button theme="danger-inverse" className="mt-2 !p-2">
                  <ThumbDownIcon
                    className="h-5 w-5"
                    onClick={() => handleUnrequesting(request)}
                  />
                </Button>
              ) : (
                <Button
                  theme="positive-inverse"
                  className="mt-2 !p-2"
                  onClick={() => handleRequesting(request)}
                  disabled={!party?.allowsExplicit && request.explicit}
                >
                  {!party?.allowsExplicit && request.explicit ? (
                    <BanIcon className="h-5 w-5" />
                  ) : (
                    <ThumbUpIcon className="h-5 w-5" />
                  )}
                </Button>
              ))}

            {type === "request" &&
              (request.requesters.includes(user?.phoneNumber ?? "") ? (
                <Button theme="danger-inverse" className="mt-2 !p-2">
                  <ThumbDownIcon
                    className="h-5 w-5"
                    onClick={() => handleUnrequesting(request)}
                  />
                </Button>
              ) : (
                <Button
                  theme="positive-inverse"
                  className="mt-2 !p-2"
                  onClick={() => handleRequesting(request)}
                >
                  <ThumbUpIcon className="h-5 w-5" />
                </Button>
              ))}

            {request.preview_url !== null && <AudioPlayer request={request} />}

            {type === "request" && user?.phoneNumber === party?.host && (
              <Button
                theme="primary-inverse"
                className="mt-2 !p-2"
                onClick={() => handleRemovingRequest(request)}
              >
                <TrashIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </li>
    </Flipped>
  );
};

export default Song;
