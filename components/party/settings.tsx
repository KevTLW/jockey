"use client";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useMutation } from "convex/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Fragment, MouseEvent, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import Button from "@/components/ui/button";
import Link from "@/components/ui/link";

interface SettingsProps {
  party: Doc<"parties">;
  partyId: Id<"parties">;
}

export default function Settings({ party, partyId }: SettingsProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [themes] = useState(["system", "dark", "light"]);

  const updateExplicitMode = useMutation(api.parties.updateExplicitMode);
  const deleteParty = useMutation(api.parties.deleteParty);

  const handleExplicitModeToggle = async () => {
    try {
      await updateExplicitMode({
        id: partyId,
        allowsExplicit: !party.allowsExplicit,
      });
    } catch {
      // Toggle failed silently
    }
  };

  const handleSignOut = async (e: MouseEvent<Element>) => {
    e.preventDefault();
    await signOut();
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
                  <ChevronUpDownIcon
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
                  {themes.map((t, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pr-2 ${
                          active
                            ? "bg-sky-700/25 text-sky-700 dark:bg-sky-300/25 dark:text-sky-300"
                            : "bg-slate-300/75 text-slate-900 dark:bg-slate-600/75 dark:text-slate-50"
                        }`
                      }
                      value={t}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-semibold" : "font-normal"
                            }`}
                          >
                            {t}
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
      <li className="flex items-center justify-between gap-2">
        <p className="text-left">toggle explicit mode</p>
        <Button
          theme={party.allowsExplicit ? "danger" : "positive"}
          onClick={handleExplicitModeToggle}
        >
          {party.allowsExplicit ? "disable" : "enable"}
        </Button>
      </li>
      <li className="flex items-center justify-between gap-2">
        <p className="text-left">sign out</p>
        <Link href="/" theme="danger" onClick={handleSignOut}>
          sign out
        </Link>
      </li>
    </ul>
  );
}
