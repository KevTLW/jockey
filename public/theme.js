(function () {
  const prefersDarkMode =
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      matchMedia("(prefers-color-scheme: dark)").matches);

  if (prefersDarkMode) {
    document.querySelector("html")?.classList.add("dark");
    document.querySelector("html")?.classList.remove("light");
  } else {
    document.querySelector("html")?.classList.add("light");
    document.querySelector("html")?.classList.remove("dark");
  }
})();
