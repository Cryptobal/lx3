import { useTranslations } from "next-intl";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { Link } from "@/lib/i18n/routing";
import { Monitor, Zap, Globe, Compass, ArrowUpRight } from "lucide-react";

const serviceIcons = [Monitor, Zap, Globe, Compass];

const serviceLinks = [
  "/servicios/aplicaciones-internas",
  "/servicios/automatizacion-ia",
  "/servicios/sitios-web",
  "/servicios/consultoria",
] as const;

export function Services() {
  const t = useTranslations("services");

  const services = [
    { title: t("s1Title"), desc: t("s1Desc"), link: serviceLinks[0] },
    { title: t("s2Title"), desc: t("s2Desc"), link: serviceLinks[1] },
    { title: t("s3Title"), desc: t("s3Desc"), link: serviceLinks[2] },
    { title: t("s4Title"), desc: t("s4Desc"), link: serviceLinks[3] },
  ];

  return (
    <SectionWrapper>
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-lg text-white/60">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((service, i) => {
          const Icon = serviceIcons[i];
          return (
            <Link
              key={i}
              href={service.link}
              className="group relative rounded-2xl border border-white/5 bg-surface-elevated p-8 transition-all duration-300 hover:border-accent/30 hover:glow-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Icon className="h-6 w-6 text-accent" />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold text-white">
                {service.title}
              </h3>

              <p className="mt-3 leading-relaxed text-white/60">
                {service.desc}
              </p>

              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>Ver servicio</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
