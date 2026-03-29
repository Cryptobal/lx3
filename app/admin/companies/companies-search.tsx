"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";

interface CompaniesSearchProps {
  defaultSearch?: string;
}

export function CompaniesSearch({ defaultSearch = "" }: CompaniesSearchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(defaultSearch);

  function handleSearch(value: string) {
    setSearch(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      router.push(`/admin/companies?${params.toString()}`);
    });
  }

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar empresas..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className={`w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${isPending ? "opacity-70" : ""}`}
      />
    </div>
  );
}
