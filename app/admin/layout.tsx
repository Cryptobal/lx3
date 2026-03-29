import { ThemeProvider } from "@/components/growth-os/layout/ThemeProvider";
import { ServiceWorkerRegistrar } from "@/components/growth-os/layout/ServiceWorkerRegistrar";
import { Toaster } from "sonner";

export const metadata = {
  title: "Growth OS | LX3",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent" as const,
    title: "LX3 CRM",
  },
};

export const viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover" as const,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {children}
      <Toaster position="top-right" richColors theme="dark" />
      <ServiceWorkerRegistrar />
    </ThemeProvider>
  );
}
