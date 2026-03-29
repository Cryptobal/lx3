import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/growth-os/layout/ThemeProvider";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Growth OS | LX3",
  description: "CRM y herramientas de crecimiento para LX3",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} bg-zinc-50 dark:bg-zinc-950 font-sans antialiased text-zinc-900 dark:text-zinc-100`}>
        <ThemeProvider>
          <SessionProvider>
            {children}
            <Toaster position="top-right" richColors theme="system" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
