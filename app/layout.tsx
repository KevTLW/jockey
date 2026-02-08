import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "next-themes";
import { Metadata } from "next";
import "@/app/globals.css";
import { ConvexClientProvider } from "@/app/convex-client-provider";

export const metadata: Metadata = {
  title: "jockey",
  description: "the essential to every party",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider verbose>
      <html lang="en" suppressHydrationWarning>
        <body className="bg-slate-50 font-mono antialiased transition dark:bg-slate-900">
          <ThemeProvider attribute="class" defaultTheme="system">
            <ConvexClientProvider>
              <div className="container mx-auto">{children}</div>
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
