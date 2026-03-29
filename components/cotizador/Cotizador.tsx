"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

import type { CotizadorState, FormData, ProductType } from "./types";
import { getPackages, getAddons, getPlans, formatCLP } from "./data";
import { StepIndicator } from "./StepIndicator";
import { PackageCard } from "./PackageCard";
import { AddonItem } from "./AddonItem";
import { MonthlyPlanCard } from "./MonthlyPlanCard";
import { PriceSummary } from "./PriceSummary";
import { FloatingBar } from "./FloatingBar";
import { InfoModal } from "./InfoModal";

const TOTAL_STEPS = 4;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

function initialState(): CotizadorState {
  return {
    product: "web",
    step: 1,
    selectedPackage: null,
    addonCounts: {},
    monthlyPlan: null,
    formData: { name: "", company: "", email: "", phone: "", notes: "" },
  };
}

export function Cotizador() {
  const t = useTranslations("cotizadorPage");

  const [state, setState] = useState<CotizadorState>(initialState);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const packages = useMemo(() => getPackages(state.product), [state.product]);
  const addons = useMemo(() => getAddons(state.product), [state.product]);
  const plans = useMemo(() => getPlans(state.product), [state.product]);

  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === state.selectedPackage) ?? null,
    [packages, state.selectedPackage]
  );

  // Calculate totals
  const totalOneTime = useMemo(() => {
    const pkgPrice = selectedPkg?.price ?? 0;
    const addonsPrice = addons.reduce((sum, addon) => {
      const count = state.addonCounts[addon.id] ?? 0;
      const isIncluded = selectedPkg?.includedAddons.includes(addon.id);
      if (isIncluded) return sum;
      return sum + addon.price * count;
    }, 0);
    return pkgPrice + addonsPrice;
  }, [selectedPkg, state.addonCounts, addons]);

  const totalMonthly = useMemo(() => {
    const plan = plans.find((p) => p.id === state.monthlyPlan);
    return plan?.price ?? 0;
  }, [state.monthlyPlan, plans]);

  const switchProduct = useCallback((product: ProductType) => {
    setState({ ...initialState(), product });
    setDirection(1);
    setError(null);
  }, []);

  const next = useCallback(() => {
    if (state.step < TOTAL_STEPS) {
      setDirection(1);
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  }, [state.step]);

  const prev = useCallback(() => {
    if (state.step > 1) {
      setDirection(-1);
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  }, [state.step]);

  const updateFormData = useCallback((field: keyof FormData, value: string) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
  }, []);

  const handleSubmit = async () => {
    if (!state.formData.name || !state.formData.email) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/cotizador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: state.product,
          formData: state.formData,
          selectedPackage: state.selectedPackage,
          addonCounts: state.addonCounts,
          monthlyPlan: state.monthlyPlan,
          totalOneTime,
          totalMonthly,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || t("form.errorGeneric"));
      }
    } catch {
      setError(t("form.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setState(initialState());
    setSubmitted(false);
    setError(null);
  };

  const stepLabels = [
    t("steps.package"),
    t("steps.addons"),
    t("steps.plan"),
    t("steps.details"),
  ];

  const canProceed =
    state.step === 1
      ? !!state.selectedPackage
      : state.step === 4
        ? !!(state.formData.name && state.formData.email)
        : true;

  // Success screen
  if (submitted) {
    const plan = plans.find((p) => p.id === state.monthlyPlan);

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--green)]/10">
            <svg className="h-10 w-10 text-[var(--green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)]">
            {t("success.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            {t("success.message", {
              name: state.formData.name,
              package: selectedPkg ? t(selectedPkg.nameKey) : "",
              total: formatCLP(totalOneTime),
              plan: plan ? `${t(plan.nameKey)} (${formatCLP(plan.price)}/mes)` : t("success.noPlan"),
            })}
          </p>
          <button
            onClick={reset}
            className="mt-8 rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            {t("success.newQuote")}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 sm:px-6 min-[900px]:pb-8">
      {/* Product Tabs */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-1">
          <button
            type="button"
            onClick={() => switchProduct("web")}
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200",
              state.product === "web"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {t("tabs.web")}
          </button>
          <button
            type="button"
            onClick={() => switchProduct("software")}
            className={cn(
              "rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200",
              state.product === "software"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {t("tabs.software")}
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="mb-8 sm:mb-10">
        <StepIndicator currentStep={state.step} totalSteps={TOTAL_STEPS} labels={stepLabels} />
      </div>

      <div className="min-[900px]:flex min-[900px]:gap-8">
        {/* Main content */}
        <div className="flex-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${state.product}-${state.step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {state.step === 1 && (
                <Step1
                  t={t}
                  packages={packages}
                  selectedPackage={state.selectedPackage}
                  onSelect={(id) =>
                    setState((p) => ({
                      ...p,
                      selectedPackage: id,
                      addonCounts: {},
                    }))
                  }
                />
              )}
              {state.step === 2 && (
                <Step2
                  t={t}
                  addons={addons}
                  addonCounts={state.addonCounts}
                  selectedPkg={selectedPkg}
                  onChange={(id, count) =>
                    setState((p) => ({
                      ...p,
                      addonCounts: { ...p.addonCounts, [id]: count },
                    }))
                  }
                />
              )}
              {state.step === 3 && (
                <Step3
                  t={t}
                  plans={plans}
                  selectedPlan={state.monthlyPlan}
                  onSelect={(id) =>
                    setState((p) => ({
                      ...p,
                      monthlyPlan: p.monthlyPlan === id ? null : id,
                    }))
                  }
                />
              )}
              {state.step === 4 && (
                <Step4
                  t={t}
                  state={state}
                  totalOneTime={totalOneTime}
                  totalMonthly={totalMonthly}
                  formData={state.formData}
                  onFieldChange={updateFormData}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  error={error}
                  canSubmit={canProceed}
                  onBack={prev}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {state.step < 4 && (
            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                onClick={prev}
                disabled={state.step === 1}
                className={cn(
                  "rounded-xl border border-[var(--border-default)] px-6 py-3 text-sm font-medium transition-all",
                  state.step === 1
                    ? "cursor-not-allowed opacity-30"
                    : "text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                )}
              >
                {t("nav.back")}
              </button>
              <button
                onClick={next}
                disabled={!canProceed}
                className={cn(
                  "rounded-xl px-8 py-3 text-sm font-medium text-white transition-all",
                  canProceed
                    ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
                    : "cursor-not-allowed bg-[var(--bg-surface)] text-[var(--text-tertiary)]"
                )}
              >
                {t("nav.next")}
              </button>
            </div>
          )}
        </div>

        {/* Desktop sidebar */}
        <div className="hidden min-[900px]:block min-[900px]:w-80">
          <div className="sticky top-8">
            <PriceSummary
              state={state}
              totalOneTime={totalOneTime}
              totalMonthly={totalMonthly}
              t={(key: string) => t(key)}
              tRaw={(key: string) => t.raw(key)}
            />
          </div>
        </div>
      </div>

      {/* Mobile floating bar */}
      <div className="min-[900px]:hidden">
        <FloatingBar
          totalOneTime={totalOneTime}
          totalMonthly={totalMonthly}
          labelOneTime={t("summary.totalOneTime")}
          labelMonthly={t("summary.totalMonthly")}
        />
      </div>
    </div>
  );
}

/* ─── Step components ──────────────────────────────────────── */

function Step1({
  t,
  packages,
  selectedPackage,
  onSelect,
}: {
  t: ReturnType<typeof useTranslations>;
  packages: ReturnType<typeof getPackages>;
  selectedPackage: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
        {t("step1.title")}
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {t("step1.subtitle")}
      </p>
      <div className="mt-6 space-y-4">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            selected={selectedPackage === pkg.id}
            onSelect={() => onSelect(pkg.id)}
            name={t(pkg.nameKey)}
            description={t(pkg.descriptionKey)}
            includes={t.raw(pkg.includesKey) as string[]}
            badgeLabel={pkg.badge ? t(`badges.${pkg.badge}`) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function Step2({
  t,
  addons,
  addonCounts,
  selectedPkg,
  onChange,
}: {
  t: ReturnType<typeof useTranslations>;
  addons: ReturnType<typeof getAddons>;
  addonCounts: Record<string, number>;
  selectedPkg: ReturnType<typeof getPackages>[number] | null;
  onChange: (id: string, count: number) => void;
}) {
  const [infoAddon, setInfoAddon] = useState<string | null>(null);
  const infoAddonData = addons.find((a) => a.id === infoAddon);

  const includedAddons = addons.filter((a) => selectedPkg?.includedAddons.includes(a.id));
  const availableAddons = addons.filter((a) => !selectedPkg?.includedAddons.includes(a.id));

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
        {t("step2.title")}
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {t("step2.subtitle")}
      </p>

      {/* Included addons */}
      {includedAddons.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-medium text-[var(--green)]">
            {t("step2.includedTitle", { package: selectedPkg ? t(selectedPkg.nameKey) : "" })}
          </h3>
          <div className="space-y-3">
            {includedAddons.map((addon) => (
              <AddonItem
                key={addon.id}
                name={t(addon.nameKey)}
                price={addon.price}
                type={addon.type}
                count={0}
                onChange={() => {}}
                included
                includedLabel={t("step2.includedLabel")}
                onInfoClick={() => setInfoAddon(addon.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available addons */}
      <div className={cn("mt-6", includedAddons.length > 0 && "mt-8")}>
        {includedAddons.length > 0 && (
          <h3 className="mb-3 text-sm font-medium text-[var(--text-secondary)]">
            {t("step2.additionalTitle")}
          </h3>
        )}
        <div className="space-y-3">
          {availableAddons.map((addon) => (
            <AddonItem
              key={addon.id}
              name={t(addon.nameKey)}
              price={addon.price}
              type={addon.type}
              count={addonCounts[addon.id] ?? 0}
              onChange={(count) => onChange(addon.id, count)}
              onInfoClick={() => setInfoAddon(addon.id)}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-[var(--text-tertiary)]">
        {t("step2.note")}
      </p>

      {/* Info Modal */}
      <InfoModal
        open={!!infoAddon}
        onClose={() => setInfoAddon(null)}
        title={infoAddonData ? t(infoAddonData.nameKey) : ""}
        description={infoAddonData ? t(infoAddonData.infoKey) : ""}
        closeLabel={t("step2.closeInfo")}
      />
    </div>
  );
}

function Step3({
  t,
  plans,
  selectedPlan,
  onSelect,
}: {
  t: ReturnType<typeof useTranslations>;
  plans: ReturnType<typeof getPlans>;
  selectedPlan: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
        {t("step3.title")}
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {t("step3.subtitle")}
      </p>
      <div className="mt-6 space-y-4">
        {plans.map((plan) => (
          <MonthlyPlanCard
            key={plan.id}
            planId={plan.id}
            name={t(plan.nameKey)}
            features={t.raw(plan.featuresKey) as string[]}
            price={plan.price}
            selected={selectedPlan === plan.id}
            onSelect={() => onSelect(plan.id)}
            badgeLabel={plan.badge ? t(`badges.${plan.badge}`) : undefined}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--text-tertiary)]">
        {t("step3.note")}
      </p>
    </div>
  );
}

function Step4({
  t,
  state,
  totalOneTime,
  totalMonthly,
  formData,
  onFieldChange,
  onSubmit,
  submitting,
  error,
  canSubmit,
  onBack,
}: {
  t: ReturnType<typeof useTranslations>;
  state: CotizadorState;
  totalOneTime: number;
  totalMonthly: number;
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
  canSubmit: boolean;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
        {t("step4.title")}
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {t("step4.subtitle")}
      </p>

      {/* Mobile summary (no sidebar on mobile) */}
      <div className="mt-6 min-[900px]:hidden">
        <PriceSummary
          state={state}
          totalOneTime={totalOneTime}
          totalMonthly={totalMonthly}
          t={(key: string) => t(key)}
          tRaw={(key: string) => t.raw(key)}
        />
      </div>

      {/* Form */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("form.name")} *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("form.namePlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("form.company")}
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => onFieldChange("company", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("form.companyPlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("form.email")} *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("form.emailPlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("form.phone")}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("form.phonePlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("form.notes")}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => onFieldChange("notes", e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("form.notesPlaceholder")}
          />
        </div>
      </div>

      {/* Custom quote CTA */}
      <div className="mt-6 rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-surface)] p-5 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          {t("form.customQuoteText")}
        </p>
        <Link
          href="/contacto"
          className="mt-2 inline-block text-sm font-semibold text-[var(--coral)] transition-colors hover:text-[var(--coral-hover)]"
        >
          {t("form.customQuoteLink")}
        </Link>
      </div>

      <p className="mt-4 text-xs text-[var(--text-tertiary)]">
        {t("form.disclaimer")}
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-[var(--border-default)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          {t("nav.back")}
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={cn(
            "flex-1 rounded-xl py-3.5 text-sm font-semibold text-white transition-all",
            canSubmit && !submitting
              ? "bg-gradient-to-r from-[var(--accent)] to-[var(--coral)] hover:shadow-[0_0_24px_var(--accent-glow)]"
              : "cursor-not-allowed bg-[var(--bg-surface)] text-[var(--text-tertiary)]"
          )}
        >
          {submitting ? t("form.submitting") : t("form.submit")}
        </button>
      </div>
    </div>
  );
}
