"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

import type { CotizadorState, FormData } from "./types";
import { packages, addons, monthlyPlans, formatCLP } from "./data";
import { StepIndicator } from "./StepIndicator";
import { PackageCard } from "./PackageCard";
import { AddonItem } from "./AddonItem";
import { MonthlyPlanCard } from "./MonthlyPlanCard";
import { PriceSummary } from "./PriceSummary";
import { FloatingBar } from "./FloatingBar";

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

export function Cotizador() {
  const t = useTranslations("cotizadorPage");

  const [state, setState] = useState<CotizadorState>({
    step: 1,
    selectedPackage: null,
    addonCounts: {},
    monthlyPlan: null,
    formData: { name: "", company: "", email: "", phone: "" },
  });

  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate totals
  const totalOneTime = useMemo(() => {
    const pkg = packages.find((p) => p.id === state.selectedPackage);
    const pkgPrice = pkg?.price ?? 0;
    const addonsPrice = addons.reduce((sum, addon) => {
      const count = state.addonCounts[addon.id] ?? 0;
      return sum + addon.price * count;
    }, 0);
    return pkgPrice + addonsPrice;
  }, [state.selectedPackage, state.addonCounts]);

  const totalMonthly = useMemo(() => {
    const plan = monthlyPlans.find((p) => p.id === state.monthlyPlan);
    return plan?.price ?? 0;
  }, [state.monthlyPlan]);

  const goTo = useCallback((step: number) => {
    setDirection(step > state.step ? 1 : -1);
    setState((prev) => ({ ...prev, step }));
  }, [state.step]);

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
    setState({
      step: 1,
      selectedPackage: null,
      addonCounts: {},
      monthlyPlan: null,
      formData: { name: "", company: "", email: "", phone: "" },
    });
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
    const pkg = packages.find((p) => p.id === state.selectedPackage);
    const plan = monthlyPlans.find((p) => p.id === state.monthlyPlan);

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--green-light)]">
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
              package: pkg ? t(pkg.nameKey) : "",
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
      {/* Step indicator */}
      <div className="mb-8 sm:mb-10">
        <StepIndicator currentStep={state.step} totalSteps={TOTAL_STEPS} labels={stepLabels} />
      </div>

      <div className="min-[900px]:flex min-[900px]:gap-8">
        {/* Main content */}
        <div className="flex-1">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={state.step}
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
                  selectedPackage={state.selectedPackage}
                  onSelect={(id) => setState((p) => ({ ...p, selectedPackage: id }))}
                />
              )}
              {state.step === 2 && (
                <Step2
                  t={t}
                  addonCounts={state.addonCounts}
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
  selectedPackage,
  onSelect,
}: {
  t: ReturnType<typeof useTranslations>;
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
  addonCounts,
  onChange,
}: {
  t: ReturnType<typeof useTranslations>;
  addonCounts: Record<string, number>;
  onChange: (id: string, count: number) => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
        {t("step2.title")}
      </h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        {t("step2.subtitle")}
      </p>
      <div className="mt-6 space-y-3">
        {addons.map((addon) => (
          <AddonItem
            key={addon.id}
            name={t(addon.nameKey)}
            price={addon.price}
            type={addon.type}
            count={addonCounts[addon.id] ?? 0}
            onChange={(count) => onChange(addon.id, count)}
          />
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--text-tertiary)]">
        {t("step2.note")}
      </p>
    </div>
  );
}

function Step3({
  t,
  selectedPlan,
  onSelect,
}: {
  t: ReturnType<typeof useTranslations>;
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
        {monthlyPlans.map((plan) => (
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
