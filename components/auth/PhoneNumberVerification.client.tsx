import { Field, Form, Formik } from "formik";
import { forwardRef } from "react";
import { useSignInWithPhoneNumber } from "../../hooks/useSignInWithPhoneNumber";
import { auth } from "../../utils/firebase";
import Button from "../ui/Button";

interface PhoneNumberVerificationProps {
  closeModal: () => void;
  signIn: (number: string, isResent?: boolean) => Promise<boolean>;
}

export const PhoneNumberVerification = forwardRef<
  HTMLInputElement,
  PhoneNumberVerificationProps
>(({ closeModal, signIn }, phoneNumberInputRef) => {
  const { resetError } = useSignInWithPhoneNumber(auth, "sign-in-button", {
    size: "invisible",
  });

  return (
    <Formik
      initialValues={{
        number: "",
      }}
      onSubmit={async (values) => {
        try {
          await signIn(`+1${values.number}`);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <Form className="space-y-4">
        <div className="grid gap-6">
          <div className="col-span-12">
            <label htmlFor="number" className="mb-2 block text-sm font-medium">
              enter phone number
            </label>
            <Field
              className="block w-full rounded-md bg-slate-300/75 p-2 shadow-xl outline-none transition duration-300 invalid:bg-red-400 focus:ring focus:ring-sky-700/75 dark:bg-slate-600/75 dark:focus:ring-sky-300/75"
              type="tel"
              name="number"
              autoComplete="number"
              onKeyUp={resetError}
              innerRef={phoneNumberInputRef}
            />
          </div>
        </div>

        <div className="flex">
          <Button
            type="button"
            theme="danger"
            className="w-full"
            onClick={closeModal}
          >
            cancel
          </Button>
          <Button
            id="sign-in-button"
            type="submit"
            theme="primary"
            className="ml-2 w-full"
          >
            submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
});

export default PhoneNumberVerification;
