import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: "default" | "primary";
}

export const Button = ({
  children,
  className,
  theme = "default",
  ...props
}: ButtonProps) => {
  const classes = [
    className,
    "rounded border-2 bg-transparent px-4 py-2 text-center font-bold shadow-xl transition duration-300 focus:outline-none focus:ring",
    theme === "primary" &&
      "border-sky-700 text-sky-700 shadow-sky-500/25 hover:bg-sky-700 hover:text-slate-50 focus:ring-sky-700/75 active:bg-sky-800 active:text-slate-50 dark:border-sky-300 dark:text-sky-300 dark:shadow-sky-300/25 dark:hover:bg-sky-300 dark:hover:text-slate-900 dark:focus:ring-sky-300/75 dark:active:bg-sky-400 dark:active:text-slate-900",
  ];

  return (
    <button className={classes.filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
};

export default Button;
