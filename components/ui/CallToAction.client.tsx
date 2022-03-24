import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useReducer, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth_errorAtom } from "../../state/atoms";
import { auth } from "../../utils/firebase";
import Button from "./Button.client";
import Modal from "./Modal.client";

const CallToAction = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);

  const handleCallToAction = () => {
    if (user) {
      router.push("/party");
    } else {
      setLoginModalIsOpen(true);
    }
  };

  return (
    <>
      <Button theme="primary" onClick={handleCallToAction}>
        use jockey
      </Button>
      <Modal isOpen={loginModalIsOpen} setIsOpen={setLoginModalIsOpen} />
    </>
  );
};

export default CallToAction;
