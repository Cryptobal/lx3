"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { DiagnosticState, DiagnosticFormData } from "./types";

const TOTAL_STEPS = 6;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

function initialDiagState(): DiagnosticState {
  return {
    step: 1,
    needs: [],
    needsOther: "",
    userCount: "",
    currentTools: [],
    currentToolsOther: "",
    hasTechTeam: "",
    budget: "",
    formData: { name: "", company: "", email: "", phone: "", description: "" },
  };
}

export function DiagnosticWizard() {
  const t = useTranslations("cotizadorPage.diagnostic");
  const [state, setState] = useState<DiagnosticState>(initialDiagState);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = (state.step / TOTAL_STEPS) * 100;

  const canProceed = (() => {
    switch (state.step) {
      case 1: return state.needs.length > 0;
      case 2: return !!state.userCount;
      case 3: return state.currentTools.length > 0;
      case 4: return !!state.hasTechTeam;
      case 5: return !!state.budget;
      case 6: return !!(state.formData.name && state.formData.company && state.formData.email);
      default: return false;
    }
  })();

  const next = useCallback(() => {
    if (state.step < TOTAL_STEPS && canProceed) {
      setDirection(1);
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  }, [state.step, canProceed]);

  const prev = useCallback(() => {
    if (state.step > 1) {
      setDirection(-1);
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  }, [state.step]);

  const toggleNeed = (val: string) => {
    setState((prev) => ({
      ...prev,
      needs: prev.needs.includes(val)
        ? prev.needs.filter((n) => n !== val)
        : [...prev.needs, val],
    }));
  };

  const toggleTool = (val: string) => {
    setState((prev) => ({
      ...prev,
      currentTools: prev.currentTools.includes(val)
        ? prev.currentTools.filter((t) => t !== val)
        : [...prev.currentTools, val],
    }));
  };

  const updateForm = (field: keyof DiagnosticFormData, value: string) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!canProceed) return;
    setSubmitting(true);
    setError(null);

    try {
      const needsList = [...state.needs];
      if (state.needs.includes("other") && state.needsOther) {
        needsList[needsList.indexOf("other")] = `Otro: ${state.needsOther}`;
      }
      const toolsList = [...state.currentTools];
      if (state.currentTools.includes("other") && state.currentToolsOther) {
        toolsList[toolsList.indexOf("other")] = `Otro: ${state.currentToolsOther}`;
      }

      const res = await fetch("/api/cotizador/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          needs: needsList,
          userCount: state.userCount,
          currentTools: toolsList,
          hasTechTeam: state.hasTechTeam,
          budget: state.budget,
          formData: state.formData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || t("errorGeneric"));
      }
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
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
            {t("success.message")}
          </p>
          <button
            onClick={() => { setState(initialDiagState()); setSubmitted(false); }}
            className="mt-8 rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-medium text-white transition-all hover:bg-[var(--accent-hover)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            {t("success.backHome")}
          </button>
        </motion.div>
      </div>
    );
  }

  const needsOptions = t.raw("q1.options") as string[];
  const userCountOptions = t.raw("q2.options") as string[];
  const toolsOptions = t.raw("q3.options") as string[];
  const techTeamOptions = t.raw("q4.options") as string[];
  const budgetOptions = t.raw("q5.options") as string[];

  const needsValues = ["crm", "erp", "portal", "dashboard", "mobile", "ai-automation", "other"];
  const userCountValues = ["1-10", "10-50", "50-200", "200+"];
  const toolsValues = ["excel", "legacy", "saas", "erp", "nothing", "other"];
  const techTeamValues = ["yes-devs", "it-no-dev", "no-external"];
  const budgetValues = ["under-3m", "3m-8m", "8m-15m", "over-15m", "unsure"];

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {t("subtitle")}
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--bg-surface)]">
          <motion.div
            className="h-full rounded-full bg-[var(--accent)]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-[var(--text-tertiary)]">
          {state.step} / {TOTAL_STEPS}
        </p>
      </div>

      {/* Questions */}
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
            <QuestionMultiSelect
              question={t("q1.question")}
              options={needsOptions}
              values={needsValues}
              selected={state.needs}
              onToggle={toggleNeed}
              showOther={state.needs.includes("other")}
              otherValue={state.needsOther}
              onOtherChange={(v) => setState((p) => ({ ...p, needsOther: v }))}
              otherPlaceholder={t("q1.otherPlaceholder")}
            />
          )}
          {state.step === 2 && (
            <QuestionSingleSelect
              question={t("q2.question")}
              options={userCountOptions}
              values={userCountValues}
              selected={state.userCount}
              onSelect={(v) => setState((p) => ({ ...p, userCount: v }))}
            />
          )}
          {state.step === 3 && (
            <QuestionMultiSelect
              question={t("q3.question")}
              options={toolsOptions}
              values={toolsValues}
              selected={state.currentTools}
              onToggle={toggleTool}
              showOther={state.currentTools.includes("other")}
              otherValue={state.currentToolsOther}
              onOtherChange={(v) => setState((p) => ({ ...p, currentToolsOther: v }))}
              otherPlaceholder={t("q3.otherPlaceholder")}
            />
          )}
          {state.step === 4 && (
            <QuestionSingleSelect
              question={t("q4.question")}
              options={techTeamOptions}
              values={techTeamValues}
              selected={state.hasTechTeam}
              onSelect={(v) => setState((p) => ({ ...p, hasTechTeam: v }))}
            />
          )}
          {state.step === 5 && (
            <QuestionSingleSelect
              question={t("q5.question")}
              options={budgetOptions}
              values={budgetValues}
              selected={state.budget}
              onSelect={(v) => setState((p) => ({ ...p, budget: v }))}
            />
          )}
          {state.step === 6 && (
            <ContactStep
              t={t}
              formData={state.formData}
              onFieldChange={updateForm}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      {/* Navigation */}
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
        {state.step < TOTAL_STEPS ? (
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
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed || submitting}
            className={cn(
              "flex-1 rounded-xl py-3.5 text-sm font-semibold text-white transition-all",
              canProceed && !submitting
                ? "bg-gradient-to-r from-[var(--accent)] to-[var(--coral)] hover:shadow-[0_0_24px_var(--accent-glow)]"
                : "cursor-not-allowed bg-[var(--bg-surface)] text-[var(--text-tertiary)]"
            )}
          >
            {submitting ? t("nav.submitting") : t("nav.submit")}
          </button>
        )}
      </div>

      {/* Social proof */}
      <div className="mt-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
        <p className="text-sm italic leading-relaxed text-[var(--text-secondary)]">
          {t("socialProof")}
        </p>
      </div>
    </div>
  );
}

/* ─── Question components ──────────────────────────────── */

function QuestionMultiSelect({
  question,
  options,
  values,
  selected,
  onToggle,
  showOther,
  otherValue,
  onOtherChange,
  otherPlaceholder,
}: {
  question: string;
  options: string[];
  values: string[];
  selected: string[];
  onToggle: (val: string) => void;
  showOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  otherPlaceholder?: string;
}) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
        {question}
      </h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {options.map((label, i) => {
          const val = values[i];
          const isSelected = selected.includes(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => onToggle(val)}
              className={cn(
                "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      {showOther && onOtherChange && (
        <input
          type="text"
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
          className="mt-3 w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          placeholder={otherPlaceholder}
        />
      )}
    </div>
  );
}

function QuestionSingleSelect({
  question,
  options,
  values,
  selected,
  onSelect,
}: {
  question: string;
  options: string[];
  values: string[];
  selected: string;
  onSelect: (val: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
        {question}
      </h3>
      <div className="mt-4 space-y-2">
        {options.map((label, i) => {
          const val = values[i];
          const isSelected = selected === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onSelect(val)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-all duration-200",
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]"
                  : "border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]"
              )}
            >
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)]"
                    : "border-[var(--border-strong)]"
                )}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContactStep({
  t,
  formData,
  onFieldChange,
}: {
  t: ReturnType<typeof useTranslations>;
  formData: DiagnosticFormData;
  onFieldChange: (field: keyof DiagnosticFormData, value: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">
        {t("q6.question")}
      </h3>
      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("q6.name")} *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("q6.namePlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("q6.company")} *
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => onFieldChange("company", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("q6.companyPlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("q6.email")} *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => onFieldChange("email", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("q6.emailPlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("q6.phone")}
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => onFieldChange("phone", e.target.value)}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("q6.phonePlaceholder")}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
            {t("q6.description")}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder={t("q6.descriptionPlaceholder")}
          />
        </div>
      </div>
    </div>
  );
}
