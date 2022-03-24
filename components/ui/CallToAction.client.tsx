import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../utils/firebase";
import Button from "./Button.client";
import Link from "./Link.client";
import Modal from "./Modal.client";

const CallToAction = () => {
  const [user] = useAuthState(auth);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

  const handleCallToAction = () => {
    setLoginModalIsOpen(true);
  };

  return (
    <>
      {user ? (
        <Link theme="primary" href="/party">
          use jockey
        </Link>
      ) : (
        <Button theme="primary" onClick={handleCallToAction}>
          use jockey
        </Button>
      )}
      <Modal isOpen={loginModalIsOpen} setIsOpen={setLoginModalIsOpen} />
    </>
  );
};

export default CallToAction;
