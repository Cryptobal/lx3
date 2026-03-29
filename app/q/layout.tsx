import "../globals.css";

export const metadata = {
  title: "Cotizacion | LX3 Software Studio",
  description: "Cotizacion profesional de LX3 Software Studio",
};

export default function PublicQuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
