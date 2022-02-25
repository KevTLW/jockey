import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useCallback, useEffect } from "react";

export const themeAtomStorage = atomWithStorage<string | undefined>(
  "theme",
  undefined
);

export const useTheme = () => {
  const [theme, setTheme] = useAtom(themeAtomStorage);

  const enableLightTheme = useCallback(() => {
    document.querySelector("html")?.classList.add("light");
    document.querySelector("html")?.classList.remove("dark");
    setTheme("light");
  }, [setTheme]);

  const enableDarkTheme = useCallback(() => {
    document.querySelector("html")?.classList.add("dark");
    document.querySelector("html")?.classList.remove("light");
    setTheme("dark");
  }, [setTheme]);

  const toggleTheme = () => {
    if (theme === "light") {
      enableDarkTheme();
    } else {
      enableLightTheme();
    }
  };

  const resetThemePreference = () => {
    if (matchMedia("(prefers-color-scheme: dark)").matches) {
      enableDarkTheme();
    } else {
      enableLightTheme();
    }

    setTheme(undefined);
  };

  useEffect(() => {
    const prefersDarkTheme =
      theme === "dark" ||
      (!("theme" in localStorage) &&
        matchMedia("(prefers-color-scheme: dark)").matches);

    if (prefersDarkTheme) {
      enableDarkTheme();
    } else {
      enableLightTheme();
    }
  }, [theme, enableDarkTheme, enableLightTheme]);

  useEffect(() => {
    if (theme !== undefined) {
      setTheme(theme);
    }
  }, [theme, setTheme]);

  return {
    theme,
    enableDarkTheme,
    enableLightTheme,
    toggleTheme,
    resetThemePreference,
  };
};
