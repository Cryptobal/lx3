"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  /** Base URL path — query params are appended automatically */
  basePath: string;
  /** Extra query params to preserve (e.g. search, status) */
  extraParams?: Record<string, string>;
  /** Label for the items (e.g. "contactos", "emails") */
  itemLabel?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  basePath,
  extraParams = {},
  itemLabel = "resultados",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(p: number) {
    const params = new URLSearchParams(extraParams);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Show max 5 page numbers, centered on current page
  const maxVisible = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {from}–{to} de {total} {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        {/* Previous */}
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="rounded-md p-1.5 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className="rounded-md p-1.5 text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}

        {/* Page numbers */}
        {startPage > 1 && (
          <>
            <Link
              href={buildHref(1)}
              className="rounded-md px-2.5 py-1 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              1
            </Link>
            {startPage > 2 && (
              <span className="px-1 text-zinc-400 dark:text-zinc-600">...</span>
            )}
          </>
        )}

        {pageNumbers.map((p) => (
          <Link
            key={p}
            href={buildHref(p)}
            className={cn(
              "rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
              p === page
                ? "bg-blue-600 text-white"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {p}
          </Link>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-1 text-zinc-400 dark:text-zinc-600">...</span>
            )}
            <Link
              href={buildHref(totalPages)}
              className="rounded-md px-2.5 py-1 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Next */}
        {page < totalPages ? (
          <Link
            href={buildHref(page + 1)}
            className="rounded-md p-1.5 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="rounded-md p-1.5 text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  );
}
