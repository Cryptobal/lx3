// @ts-nocheck
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getDeal } from "@/lib/growth-os/actions/deals";
import { DealForm } from "@/components/growth-os/deals/DealForm";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getDeal(id);
  if (!result.success) notFound();

  const deal = result.data as any;

  let stages: { id: string; name: string }[] = [];
  let contacts: { id: string; name: string }[] = [];
  let companies: { id: string; name: string }[] = [];
  let users: { id: string; name: string }[] = [];

  if (prisma) {
    try {
      const [stagesData, contactsData, companiesData, usersData] =
        await Promise.all([
          prisma.pipelineStage.findMany({
            select: { id: true, name: true },
            orderBy: { order: "asc" },
          }),
          prisma.contact.findMany({
            select: { id: true, firstName: true, lastName: true },
            orderBy: { firstName: "asc" },
            take: 500,
          }),
          prisma.company.findMany({
            select: { id: true, name: true },
            orderBy: { name: "asc" },
            take: 500,
          }),
          prisma.user.findMany({
            select: { id: true, name: true, email: true },
            orderBy: { name: "asc" },
          }),
        ]);

      stages = stagesData.map((s) => ({ id: s.id, name: s.name }));
      contacts = contactsData.map((c) => ({
        id: c.id,
        name: `${c.firstName} ${c.lastName ?? ""}`.trim(),
      }));
      companies = companiesData.map((c) => ({ id: c.id, name: c.name }));
      users = usersData.map((u) => ({
        id: u.id,
        name: u.name ?? u.email ?? u.id,
      }));
    } catch {
      // Data will remain empty arrays
    }
  }

  const expectedClose = deal.expectedClose
    ? new Date(deal.expectedClose).toISOString().split("T")[0]
    : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Editar deal
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {deal.title}
        </p>
      </div>

      <DealForm
        stages={stages}
        contacts={contacts}
        companies={companies}
        users={users}
        initialData={{
          id: deal.id,
          title: deal.title,
          value: deal.value != null ? String(Number(deal.value)) : "",
          currency: deal.currency ?? "CLP",
          probability: deal.probability != null ? String(deal.probability) : "",
          expectedClose,
          stageId: deal.stageId ?? "",
          contactId: deal.contactId ?? "",
          companyId: deal.companyId ?? "",
          assignedToId: deal.assignedToId ?? "",
          notes: deal.notes ?? "",
        }}
      />
    </div>
  );
}
