"use client";

import { Menu, Search } from "lucide-react";

interface AdminTopbarProps {
  onMenuToggle: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminTopbar({ onMenuToggle, user }: AdminTopbarProps) {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 sm:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile logo */}
      <img
        src="/logo/LX3_isotipo.svg"
        alt="LX3"
        width={24}
        height={24}
        className="h-6 w-6 lg:hidden"
      />

      {/* Search */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar contactos, empresas, deals..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* User avatar (mobile only, desktop shows in sidebar) */}
      <div className="flex items-center lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}
