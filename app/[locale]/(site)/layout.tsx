import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { FloatingChatButton } from "@/components/chatbot/FloatingChatButton";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      {/* Spacer so the sticky mobile CTA never covers footer content */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
      <MobileCTABar />
      <FloatingChatButton />
      <WhatsAppButton />
    </>
  );
}
