import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useTheme } from "next-themes";
import { NextRouter } from "next/router";
import { Fragment, MouseEvent, useState } from "react";
import { useSignOut } from "../../hooks/useSignOut";
import { Party } from "../../queries/useParty";
import { auth, db } from "../../utils/firebase";
import Button from "../ui/Button.client";
import Link from "../ui/Link.client";

interface SettingsProps {
  party: Party | undefined;
  router: NextRouter;
  user: User | null | undefined;
}

export const Settings = ({ party, router, user }: SettingsProps) => {
  const signOut = useSignOut(auth);
  const { theme, setTheme } = useTheme();
  const [themes] = useState(["system", "dark", "light"]);

  const handleExplicitModeToggle = async () => {
    if (user?.phoneNumber !== party?.host) {
      return;
    }

    const document = doc(db, "parties", router.query?.id as string);

    await updateDoc(document, {
      allowsExplicit: !party?.allowsExplicit,
    });
  };

  const handleSignOut = async (e: MouseEvent<Element>) => {
    e.preventDefault();

    if (user?.phoneNumber !== party?.host) {
      signOut();
      return;
    }

    const document = doc(db, "parties", router.query?.id as string);
    await deleteDoc(document);

    const requestsRef = collection(db, "requests");
    const requestQuery = query(
      requestsRef,
      where("party", "==", router.query?.id)
    );
    const snapshot = await getDocs(requestQuery);

    snapshot.forEach(async (d) => {
      const document = doc(db, "requests", d.id);
      await deleteDoc(document);
    });

    signOut();
  };

  return (
    <ul className="mx-auto w-full max-w-xl space-y-4">
      <li className="flex items-center justify-between gap-2">
        <p className="text-left">theme</p>
        <div className="w-1/2 max-w-xs sm:w-full">
          <Listbox value={theme} onChange={setTheme}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded bg-slate-300/75 py-2 pl-2 text-left transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-700/75 focus-visible:ring-opacity-75 dark:bg-slate-600/75 dark:focus-visible:ring-sky-300/75 sm:text-sm">
                <span className="block truncate">{theme}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-sky-700 dark:text-sky-300"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 w-full overflow-auto rounded bg-slate-300 py-2 shadow ring-2 ring-sky-700/75 focus:outline-none dark:bg-slate-600 dark:ring-sky-300/75 sm:text-sm">
                  {themes.map((theme, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pr-2 ${
                          active
                            ? "bg-sky-700/25 text-sky-700 dark:bg-sky-300/25 dark:text-sky-300"
                            : "bg-slate-300/75 text-slate-900 dark:bg-slate-600/75 dark:text-slate-50"
                        }`
                      }
                      value={theme}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {theme}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-sky-700 dark:text-sky-300">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </li>
      {user?.phoneNumber === party?.host && (
        <li className="flex items-center justify-between gap-2">
          <p className="text-left">toggle explicit mode</p>
          <Button
            theme={party?.allowsExplicit ? "danger" : "positive"}
            onClick={handleExplicitModeToggle}
          >
            {party?.allowsExplicit ? "disable" : "enable"}
          </Button>
        </li>
      )}
      <li className="flex items-center justify-between gap-2">
        <p className="text-left">sign out</p>
        <Link href="/" theme="danger" onClick={handleSignOut}>
          sign out
        </Link>
      </li>
    </ul>
  );
};

export default Settings;
