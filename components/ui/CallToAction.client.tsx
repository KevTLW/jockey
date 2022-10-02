import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import AuthModal from "../auth/AuthModal.client";
import Button from "./Button.client";
import Link from "./Link.client";

const CallToAction = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);

  const handleCallToActionUnauthed = () => {
    setAuthModalIsOpen(true);
  };

  return (
    <>
      <Head>
        <title key="title">jockey</title>
      </Head>
      {user ? (
        <Link
          theme="primary"
          href={`/party/${
            Boolean(router.query?.party) ? router.query?.party : ""
          }`}
        >
          use jockey
        </Link>
      ) : (
        <Button theme="primary" onClick={handleCallToActionUnauthed}>
          use jockey
        </Button>
      )}
      <AuthModal isOpen={authModalIsOpen} setIsOpen={setAuthModalIsOpen} />
    </>
  );
};

export default CallToAction;
