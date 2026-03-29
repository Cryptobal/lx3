import { AdminShell } from "@/components/growth-os/layout/AdminShell";
import { Toaster } from "sonner";

export const metadata = { title: "Growth OS | LX3" };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <Toaster position="top-right" richColors />
    </>
  );
}
