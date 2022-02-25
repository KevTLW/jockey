import { AppProps } from "next/app";
import Script from "next/script";
import "tailwindcss/tailwind.css";

export const _App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="container mx-auto font-mono antialiased">
      <Component {...pageProps} />
      <Script src="theme.js" strategy="beforeInteractive" />
    </div>
  );
};

export default _App;
