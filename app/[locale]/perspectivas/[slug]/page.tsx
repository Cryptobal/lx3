import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Link } from "@/lib/i18n/routing";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { ArrowLeft } from "lucide-react";

// Placeholder article data — would come from MDX/CMS in production
const articles: Record<
  string,
  {
    category: string;
    date: string;
    readTime: string;
    content: {
      es: { title: string; excerpt: string; body: string[] };
      en: { title: string; excerpt: string; body: string[] };
    };
  }
> = {
  "herramientas-genericas-ai": {
    category: "strategy",
    date: "2025-02",
    readTime: "8 min",
    content: {
      es: {
        title:
          "Por que las herramientas genericas de AI no resuelven problemas especificos",
        excerpt:
          "Las empresas invierten en herramientas genericas esperando resultados especificos. Este desajuste explica por que el 70% de los proyectos de AI no llegan a produccion.",
        body: [
          "El patron es predecible. Una empresa identifica un problema operativo, busca soluciones de AI en el mercado, y encuentra herramientas que prometen resolver exactamente ese problema. Compra licencias, asigna un equipo, y seis meses despues el proyecto esta en un limbo entre piloto y produccion.",
          "El problema no esta en la tecnologia. Esta en el supuesto fundamental: que un problema especifico de tu operacion puede resolverse con una herramienta disenada para problemas genericos. Tu ventaja competitiva vive en lo que es unico de tu operacion. Las herramientas genericas, por definicion, no pueden tocar eso.",
          "La alternativa no es construir todo desde cero. Es construir lo que importa desde cero y usar herramientas genericas donde genuinamente agregan valor: en las capas de infraestructura, no en la logica de negocio que te diferencia.",
        ],
      },
      en: {
        title:
          "Why generic AI tools don't solve specific problems",
        excerpt:
          "Companies invest in generic tools expecting specific results. This mismatch explains why 70% of AI projects never make it to production.",
        body: [
          "The pattern is predictable. A company identifies an operational problem, searches for AI solutions in the market, and finds tools that promise to solve exactly that problem. They buy licenses, assign a team, and six months later the project is in limbo between pilot and production.",
          "The problem isn't the technology. It's the fundamental assumption: that a specific problem in your operation can be solved with a tool designed for generic problems. Your competitive advantage lives in what's unique about your operation. Generic tools, by definition, can't touch that.",
          "The alternative isn't building everything from scratch. It's building what matters from scratch and using generic tools where they genuinely add value: in infrastructure layers, not in the business logic that differentiates you.",
        ],
      },
    },
  },
  "costo-no-automatizar": {
    category: "operations",
    date: "2025-01",
    readTime: "6 min",
    content: {
      es: {
        title: "El verdadero costo de no automatizar: como calcularlo",
        excerpt:
          "No automatizar tiene un costo compuesto que la mayoria de empresas no calculan correctamente. Te mostramos como cuantificarlo en tu operacion.",
        body: [
          "Cuando una empresa evalua automatizar un proceso, generalmente compara el costo de la solucion contra el costo actual del proceso manual. Esta comparacion es incorrecta porque ignora el costo compuesto de no actuar.",
          "El costo de oportunidad se acumula exponencialmente. Cada mes que tu competidor opera con un proceso automatizado y tu no, la brecha se amplifica. No solo en eficiencia directa, sino en la capacidad de tomar decisiones mas rapidas con mejor informacion.",
          "El calculo correcto incluye: costo directo del proceso manual, costo de errores y retrabajo, costo de oportunidad por decisiones lentas, y costo de talento dedicado a tareas de bajo valor. La suma es consistentemente 3-5x mayor que el costo directo solamente.",
        ],
      },
      en: {
        title: "The real cost of not automating: how to calculate it",
        excerpt:
          "Not automating has a compound cost that most companies don't calculate correctly. We show you how to quantify it in your operation.",
        body: [
          "When a company evaluates automating a process, they generally compare the solution cost against the current cost of the manual process. This comparison is wrong because it ignores the compound cost of inaction.",
          "Opportunity cost accumulates exponentially. Every month your competitor operates with an automated process and you don't, the gap amplifies. Not just in direct efficiency, but in the ability to make faster decisions with better information.",
          "The correct calculation includes: direct cost of manual process, cost of errors and rework, opportunity cost from slow decisions, and cost of talent dedicated to low-value tasks. The sum is consistently 3-5x higher than direct cost alone.",
        ],
      },
    },
  },
  "decision-intelligence": {
    category: "technical",
    date: "2025-01",
    readTime: "10 min",
    content: {
      es: {
        title: "Decision Intelligence: cuando tus datos existen pero no deciden",
        excerpt:
          "Tus datos ya estan ahi. El problema es que no estan conectados al punto de decision. Decision Intelligence cierra esa brecha.",
        body: [
          "La mayoria de las empresas no tienen un problema de datos. Tienen un problema de decision. Los datos existen en abundancia: transacciones, logs, interacciones con clientes, metricas operativas. Lo que falta es el puente entre esos datos y el momento exacto en que alguien necesita tomar una decision.",
          "Decision Intelligence no es simplemente dashboards mas bonitos. Es la disciplina de conectar modelos predictivos, reglas de negocio y datos en tiempo real para que las decisiones se tomen automaticamente o con recomendaciones contextuales en el punto de necesidad.",
          "La implementacion requiere tres capas: integracion de datos en tiempo real, modelos que entienden el contexto de negocio, e interfaces que entregan la recomendacion exacta en el momento exacto al usuario correcto. Cada capa requiere ingenieria especifica para tu operacion.",
        ],
      },
      en: {
        title: "Decision Intelligence: when your data exists but doesn't decide",
        excerpt:
          "Your data is already there. The problem is it's not connected to the decision point. Decision Intelligence closes that gap.",
        body: [
          "Most companies don't have a data problem. They have a decision problem. Data exists in abundance: transactions, logs, customer interactions, operational metrics. What's missing is the bridge between that data and the exact moment someone needs to make a decision.",
          "Decision Intelligence isn't simply prettier dashboards. It's the discipline of connecting predictive models, business rules, and real-time data so decisions are made automatically or with contextual recommendations at the point of need.",
          "Implementation requires three layers: real-time data integration, models that understand business context, and interfaces that deliver the exact recommendation at the exact moment to the right user. Each layer requires engineering specific to your operation.",
        ],
      },
    },
  },
};

const categoryLabels: Record<string, Record<string, string>> = {
  strategy: { es: "Estrategia AI", en: "AI Strategy" },
  operations: { es: "Operaciones", en: "Operations" },
  technical: { es: "Deep-Dive Tecnico", en: "Technical Deep-Dive" },
};

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  const lang = (locale === "en" ? "en" : "es") as "es" | "en";
  return {
    title: article.content[lang].title,
    description: article.content[lang].excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = articles[slug];
  if (!article) notFound();

  const lang = (locale === "en" ? "en" : "es") as "es" | "en";
  const localized = article.content[lang];

  return <ArticleContent article={article} localized={localized} lang={lang} slug={slug} />;
}

function ArticleContent({
  article,
  localized,
  lang,
  slug,
}: {
  article: (typeof articles)[string];
  localized: { title: string; excerpt: string; body: string[] };
  lang: "es" | "en";
  slug: string;
}) {
  const t = useTranslations("insightsPreview");

  return (
    <SectionWrapper className="pt-32 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          href="/perspectivas"
          className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/40 transition-colors hover:text-foreground dark:text-white/40 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>

        {/* Meta */}
        <div className="mb-6 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-wider text-accent">
            {categoryLabels[article.category]?.[lang] ?? article.category}
          </span>
          <span className="text-xs text-foreground/30 dark:text-white/30">
            {article.date}
          </span>
          <span className="text-xs text-foreground/30 dark:text-white/30">
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl dark:text-white">
          {localized.title}
        </h1>

        {/* Excerpt */}
        <p className="mt-6 text-lg leading-relaxed text-foreground/60 dark:text-white/60">
          {localized.excerpt}
        </p>

        {/* Divider */}
        <div className="my-10 border-t border-foreground/5 dark:border-white/5" />

        {/* Body */}
        <div className="space-y-6">
          {localized.body.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-foreground/80 dark:text-white/80"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-foreground/5 bg-surface-elevated/50 p-8 text-center dark:border-white/5 dark:bg-surface-elevated/30">
          <p className="text-lg font-medium text-foreground dark:text-white">
            {lang === "es"
              ? "Este patron aplica a tu operacion?"
              : "Does this pattern apply to your operation?"}
          </p>
          <p className="mt-2 text-sm text-foreground/50 dark:text-white/50">
            {lang === "es"
              ? "Nuestro diagnostico gratuito identifica las oportunidades especificas para tu empresa."
              : "Our free diagnostic identifies the specific opportunities for your company."}
          </p>
          <Link
            href="/diagnostico"
            className="mt-6 inline-flex rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            {lang === "es" ? "Iniciar diagnostico" : "Start diagnostic"}
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
