import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { forwardRef } from "react";
import { useSignInWithPhoneNumber } from "../../hooks/useSignInWithPhoneNumber";
import { auth } from "../../utils/firebase";
import Button from "../ui/Button.client";

interface OTPVerificationProps {
  verifyOTP: (code: string) => Promise<boolean>;
}

export const OTPVerification = forwardRef<
  HTMLInputElement,
  OTPVerificationProps
>(({ verifyOTP }, otpInputRef) => {
  const router = useRouter();
  const { resendOTP, resetError, resetVerification } = useSignInWithPhoneNumber(
    auth,
    "sign-in-button",
    {
      size: "invisible",
    }
  );

  return (
    <Formik
      initialValues={{
        code: "",
      }}
      onSubmit={async (values) => {
        try {
          const loggedIn = await verifyOTP(values.code);
          if (loggedIn) {
            router.push("/party");
          }
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <Form className="space-y-4">
        <div className="grid gap-6">
          <div className="col-span-12">
            <label
              htmlFor="one-time-pin"
              className="mb-2 block text-sm font-medium"
            >
              enter one time pin
            </label>
            <Field
              className="block w-full rounded-md bg-slate-300/75 p-2 shadow-xl outline-none transition duration-300 focus:ring focus:ring-sky-700/75 dark:bg-slate-600/75 dark:focus:ring-sky-300/75"
              onKeyUp={resetError}
              type="text"
              name="code"
              autoComplete="one-time-code"
              inputMode="numeric"
              innerRef={otpInputRef}
            />
          </div>
        </div>

        <div className="flex">
          <Button
            type="button"
            theme="danger"
            className="w-full"
            onClick={resetVerification}
          >
            back
          </Button>
          <Button
            id="sign-in-button"
            type="button"
            theme="primary"
            className="ml-2 w-full"
            onClick={resendOTP}
          >
            retry
          </Button>
          <Button
            id="sign-in-button"
            type="submit"
            theme="positive"
            className="ml-2 w-full"
          >
            submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
});

export default OTPVerification;
