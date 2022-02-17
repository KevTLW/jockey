import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme: "default" | "primary";
}

export const Button = ({
  children,
  theme = "default",
  ...props
}: ButtonProps) => {
  const classes = [
    "rounded border-2 px-4 py-2 text-center font-bold transition focus:ring-4",
    theme === "primary" &&
      "border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white focus:ring-sky-300",
  ];

  return (
    <button className={classes.filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
};
