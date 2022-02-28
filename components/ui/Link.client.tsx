import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ReactNode } from "react";

interface LinkProps extends NextLinkProps {
  theme?: "default" | "primary";
  children?: ReactNode;
}

const Link = ({ children, href, theme }: LinkProps) => {
  const classes = [
    "inline-block rounded border-2 bg-transparent px-4 py-2 text-center font-bold shadow-xl transition duration-300 focus:outline-none focus:ring visited:text-sky-300",
    theme === "primary" &&
      "border-sky-700 text-sky-700 shadow-sky-500/25 hover:bg-sky-700 hover:text-slate-50 focus:ring-sky-700/75 active:bg-sky-800 active:text-slate-50 dark:border-sky-300 dark:text-sky-300 dark:shadow-sky-300/25 dark:hover:bg-sky-300 dark:hover:text-slate-900 dark:focus:ring-sky-300/75 dark:active:bg-sky-400 dark:active:text-slate-900",
  ];

  return (
    <NextLink href={href} passHref>
      <a className={classes.filter(Boolean).join(" ")}>{children}</a>
    </NextLink>
  );
};

export default Link;
