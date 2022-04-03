import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?:
    | "default"
    | "primary"
    | "positive"
    | "danger"
    | "primary-inverse"
    | "positive-inverse"
    | "danger-inverse";
}

export const Button = ({
  children,
  className,
  theme = "default",
  ...props
}: ButtonProps) => {
  const classes = [
    className,
    "rounded border-2 bg-transparent px-4 py-2 text-center font-bold shadow-xl transition duration-300 focus:outline-none focus:ring disabled:border-dashed disabled:opacity-50 disabled:cursor-not-allowed",
    theme === "primary" &&
      "border-sky-700 text-sky-700 shadow-sky-500/25 hover:bg-sky-700 hover:text-slate-50 focus:ring-sky-700/75 active:bg-sky-800 active:text-slate-50 dark:border-sky-300 dark:text-sky-300 dark:shadow-sky-300/25 dark:hover:bg-sky-300 dark:hover:text-slate-900 dark:focus:ring-sky-300/75 dark:active:bg-sky-400 dark:active:text-slate-900",
    theme === "positive" &&
      "border-emerald-700 text-emerald-700 shadow-emerald-500/25 hover:bg-emerald-700 hover:text-slate-50 focus:ring-emerald-700/75 active:bg-emerald-800 active:text-slate-50 dark:border-emerald-300 dark:text-emerald-300 dark:shadow-emerald-300/25 dark:hover:bg-emerald-300 dark:hover:text-slate-900 dark:focus:ring-emerald-300/75 dark:active:bg-emerald-400 dark:active:text-slate-900",
    theme === "danger" &&
      "border-rose-700 text-rose-700 shadow-rose-500/25 hover:bg-rose-700 hover:text-slate-50 focus:ring-rose-700/75 active:bg-rose-800 active:text-slate-50 dark:border-rose-300 dark:text-rose-300 dark:shadow-rose-300/25 dark:hover:bg-rose-300 dark:hover:text-slate-900 dark:focus:ring-rose-300/75 dark:active:bg-rose-400 dark:active:text-slate-900",
    theme === "primary-inverse" &&
      "border-sky-300 text-sky-300 shadow-sky-300/25 hover:bg-sky-300 hover:text-slate-900 focus:ring-sky-300/75 active:bg-sky-400 active:text-slate-900 dark:border-sky-700 dark:text-sky-700 dark:shadow-sky-500/25 dark:hover:bg-sky-700 dark:hover:text-slate-50 dark:focus:ring-sky-700/75 dark:active:bg-sky-800 dark:active:text-slate-50",
    theme === "positive-inverse" &&
      "border-emerald-300 text-emerald-300 shadow-emerald-300/25 hover:bg-emerald-300 hover:text-slate-900 focus:ring-emerald-300/75 active:bg-emerald-400 active:text-slate-900 dark:border-emerald-700 dark:text-emerald-700 dark:shadow-emerald-500/25 dark:hover:bg-emerald-700 dark:hover:text-slate-50 dark:focus:ring-emerald-700/75 dark:active:bg-emerald-800 dark:active:text-slate-50",
    theme === "danger-inverse" &&
      "border-rose-300 text-rose-300 shadow-rose-300/25 hover:bg-rose-300 hover:text-slate-900 focus:ring-rose-300/75 active:bg-rose-400 active:text-slate-900 dark:border-rose-700 dark:text-rose-700 dark:shadow-rose-500/25 dark:hover:bg-rose-700 dark:hover:text-slate-50 dark:focus:ring-rose-700/75 dark:active:bg-rose-800 dark:active:text-slate-50",
  ];

  return (
    <button className={classes.filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
};

export default Button;
