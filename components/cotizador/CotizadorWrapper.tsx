"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { ActiveTab } from "./types";

const Cotizador = dynamic(
  () => import("./Cotizador").then((mod) => mod.Cotizador),
  { ssr: false }
);

export function CotizadorWrapper() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const initialTab: ActiveTab = tab === "software" ? "software" : "web";

  return <Cotizador initialTab={initialTab} />;
}
