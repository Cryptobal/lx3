import Link from "next/link";
import { Plus } from "lucide-react";
import { getDeals } from "@/lib/growth-os/actions/deals";
import { PageHeader } from "@/components/growth-os/shared/PageHeader";
import { PipelineKanban } from "@/components/growth-os/deals/PipelineKanban";

export default async function DealsPage() {
  const { data: stages } = await getDeals();

  const totalDeals = stages.reduce(
    (sum: number, s: any) => sum + (s.deals?.length ?? 0),
    0
  );

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description={`${totalDeals} negocio${totalDeals !== 1 ? "s" : ""} en el pipeline`}
        actions={
          <Link
            href="/admin/deals/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Nuevo negocio
          </Link>
        }
      />

      <PipelineKanban stages={stages} />
    </div>
  );
}
