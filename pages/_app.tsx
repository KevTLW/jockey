import { AppProps } from "next/app";
import "tailwindcss/tailwind.css";

export const _App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="bg-gray-100 font-mono antialiased transition dark:bg-gray-900">
      <div className="container mx-auto">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default _App;
