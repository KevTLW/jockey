import { useRouter } from "next/router";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import Button from "./Button.client";
import Link from "./Link.client";
import Modal from "./Modal.client";

const CallToAction = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

  const handleCallToActionUnauthed = () => {
    setLoginModalIsOpen(true);
  };

  return (
    <>
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
      <Modal isOpen={loginModalIsOpen} setIsOpen={setLoginModalIsOpen} />
    </>
  );
};

export default CallToAction;
