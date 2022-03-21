import { Ref } from "react";
import { useSignInWithPhoneNumber } from "../../hooks/useSignInWithPhoneNumber";
import { auth } from "../../utils/firebase";
import OTPVerification from "./OTPVerification.client";
import PhoneNumberVerification from "./PhoneNumberVerification.client";

interface FormProps {
  closeModal: () => void;
  otpInputRef: Ref<HTMLInputElement>;
  phoneNumberInputRef: Ref<HTMLInputElement>;
}

export const Form = ({
  closeModal,
  otpInputRef,
  phoneNumberInputRef,
}: FormProps) => {
  const { verifiedNumber, signIn, verifyOTP } = useSignInWithPhoneNumber(
    auth,
    "sign-in-button",
    {
      size: "invisible",
    }
  );

  if (verifiedNumber === "") {
    return (
      <PhoneNumberVerification
        signIn={signIn}
        closeModal={closeModal}
        ref={phoneNumberInputRef}
      />
    );
  } else {
    return <OTPVerification verifyOTP={verifyOTP} ref={otpInputRef} />;
  }
};

export default Form;
