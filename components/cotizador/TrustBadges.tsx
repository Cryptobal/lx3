"use client";

import { useTranslations } from "next-intl";
import { Shield, KeyRound, Clock } from "lucide-react";

export function TrustBadges() {
  const t = useTranslations("cotizadorPage.trust");

  const badges = [
    { icon: Shield, titleKey: "guarantee.title", descKey: "guarantee.description" },
    { icon: KeyRound, titleKey: "ownership.title", descKey: "ownership.description" },
    { icon: Clock, titleKey: "timeline.title", descKey: "timeline.description" },
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-3">
      {badges.map(({ icon: Icon, titleKey, descKey }) => (
        <div
          key={titleKey}
          className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4"
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/10">
            <Icon className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {t(titleKey)}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
            {t(descKey)}
          </p>
        </div>
      ))}
    </div>
  );
}
