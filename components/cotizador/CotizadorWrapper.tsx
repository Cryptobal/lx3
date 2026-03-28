"use client";

import dynamic from "next/dynamic";

const Cotizador = dynamic(
  () => import("./Cotizador").then((mod) => mod.Cotizador),
  { ssr: false }
);

export function CotizadorWrapper() {
  return <Cotizador />;
}
