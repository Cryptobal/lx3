import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Linkedin,
  Building2,
  Tag,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/growth-os/shared/Badge";
import { LeadScoreBadge } from "@/components/growth-os/shared/LeadScoreBadge";
import { formatDate } from "@/lib/growth-os/utils/format";
import { calculateLeadScore } from "@/lib/growth-os/services/lead-scoring";
import { ContactTimeline } from "./ContactTimeline";
import { ContactTabs } from "./ContactTabs";
import type { ContactSource, ActivityType, QuoteStatus } from "@/lib/generated/prisma/client";

const SOURCE_LABELS: Record<string, string> = {
  MANUAL: "Manual",
  WEBSITE_FORM: "Formulario Web",
  COTIZADOR: "Cotizador",
  CHATBOT: "Chatbot",
  APOLLO: "Apollo",
  IMPORT: "Importado",
  REFERRAL: "Referido",
};

interface ContactDetailProps {
  contact: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    position: string | null;
    linkedinUrl: string | null;
    avatarUrl: string | null;
    source: ContactSource;
    tags: string[];
    notes: string | null;
    createdAt: string;
    enrichedAt: string | null;
    enrichmentData: unknown;
    company: { id: string; name: string } | null;
    deals: Array<{
      id: string;
      title: string;
      value: number | null;
      currency: string;
      stage: { name: string; color: string | null };
      createdAt: string;
    }>;
    activities: Array<{
      id: string;
      type: ActivityType;
      title: string;
      description: string | null;
      createdAt: string;
    }>;
    quotes: Array<{
      id: string;
      quoteNumber: string;
      title: string;
      total: number;
      currency: string;
      status: QuoteStatus;
      createdAt: string;
    }>;
  };
}

export function ContactDetail({ contact }: ContactDetailProps) {
  const fullName = `${contact.firstName} ${contact.lastName ?? ""}`.trim();
  const initials = `${contact.firstName[0]}${contact.lastName?.[0] ?? ""}`;

  // Calculate lead score
  const hasFilledForm = contact.activities.some(
    (a) => a.type === "FORM_SUBMISSION" || a.type === "CONTACT_CREATED"
  );
  const { score: leadScore, breakdown: leadBreakdown } = calculateLeadScore({
    email: contact.email,
    hasFilledForm,
    enriched: !!contact.enrichedAt,
  });

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/contacts"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a contactos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact header */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-semibold text-zinc-600 dark:text-zinc-400">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {fullName}
                  </h1>
                  <LeadScoreBadge score={leadScore} breakdown={leadBreakdown} size="md" />
                </div>
                {contact.position && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {contact.position}
                  </p>
                )}
                {contact.company && (
                  <Link
                    href={`/admin/companies/${contact.company.id}`}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    {contact.company.name}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ContactTabs
            activities={contact.activities}
            deals={contact.deals}
            quotes={contact.quotes}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Contact details */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Detalles del contacto
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              {contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Email</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Telefono</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {contact.linkedinUrl && (
                <div className="flex items-start gap-3">
                  <Linkedin className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">LinkedIn</p>
                    <a
                      href={contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                    >
                      Ver perfil
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Tag className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Fuente</p>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100">
                    {SOURCE_LABELS[contact.source] ?? contact.source}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Creado</p>
                  <p className="text-sm text-zinc-900 dark:text-zinc-100">
                    {formatDate(contact.createdAt)}
                  </p>
                </div>
              </div>

              {contact.tags.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {contact.notes && (
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Notas</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {contact.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Enrichment data */}
          {contact.enrichmentData !== null && contact.enrichmentData !== undefined ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Datos enriquecidos
                </h3>
                {contact.enrichedAt && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Actualizado: {formatDate(contact.enrichedAt)}
                  </p>
                )}
              </div>
              <div className="px-6 py-4">
                <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-auto max-h-64 whitespace-pre-wrap">
                  {JSON.stringify(contact.enrichmentData, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
