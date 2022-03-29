import { ThemeProvider } from "next-themes";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "tailwindcss/tailwind.css";

export const _App = ({ Component, pageProps }: AppProps) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <div className="bg-slate-50 font-mono antialiased transition dark:bg-slate-900">
          <div className="container mx-auto">
            <Component {...pageProps} />
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default _App;
