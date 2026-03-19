export function getCategoryClasses(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("inteligencia") || normalized.includes("tecnolog")) {
    return "text-[var(--coral)] border-[var(--coral)]/20 bg-[var(--coral)]/5";
  }

  if (normalized.includes("transform") || normalized === "operaciones") {
    return "text-[var(--green)] border-[var(--green)]/20 bg-[var(--green)]/5";
  }

  return "text-[var(--accent)] border-[var(--accent)]/20 bg-[var(--accent)]/5";
}

export function getCategoryLabel(category: string) {
  const normalized = category.toLowerCase();

  if (normalized === "estrategia") return "Estrategia";
  if (normalized === "tecnologia") return "Tecnología";
  if (normalized === "operaciones") return "Operaciones";

  return category;
}
