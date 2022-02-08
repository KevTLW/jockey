import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

export const _App = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default _App;
