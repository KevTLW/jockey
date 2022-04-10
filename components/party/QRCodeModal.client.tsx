import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { Dispatch, Fragment, SetStateAction } from "react";
import { OnResultFunction, QrReader } from "react-qr-reader";
import Brand from "../ui/Brand";
import Button from "../ui/Button.client";

interface QRCodeModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const QRCodeModal = ({ isOpen, setIsOpen }: QRCodeModalProps) => {
  const router = useRouter();

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleResult: OnResultFunction = async (result) => {
    if (result?.getText().startsWith(window.location.href)) {
      router.push(result.getText());
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-hidden"
        onClose={closeModal}
      >
        <div className="flex min-h-screen items-center justify-center p-2">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-slate-400 bg-opacity-75 transition-opacity dark:bg-slate-500 dark:bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-90"
          >
            <div className="relative inline-block w-full max-w-md overflow-hidden rounded bg-slate-50 p-4 align-middle font-mono text-slate-900 shadow-lg dark:bg-slate-900 dark:text-slate-50 sm:p-8">
              <div className="flex w-full justify-end">
                <Button
                  type="button"
                  theme="primary"
                  className="!p-2"
                  onClick={closeModal}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
              <h1 className="text-center text-4xl font-bold">
                <Brand
                  accent="text-sky-700 dark:text-sky-300"
                  primary="text-slate-900 dark:text-slate-50"
                />
              </h1>
              <h2 className="mt-4 text-2xl font-semibold">scan party code</h2>
              <QrReader
                constraints={{ facingMode: "environment" }}
                onResult={handleResult}
                className="mt-4"
                videoContainerStyle={{ padding: "0rem" }}
                videoStyle={{ position: "static" }}
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default QRCodeModal;
