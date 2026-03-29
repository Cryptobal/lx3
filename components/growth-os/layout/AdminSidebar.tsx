"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Building2,
  Kanban,
  FileText,
  Eye,
  Mail,
  Settings,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Contactos", href: "/admin/contacts", icon: Users },
  { label: "Empresas", href: "/admin/companies", icon: Building2 },
  { label: "Pipeline", href: "/admin/deals", icon: Kanban },
  { label: "Cotizaciones", href: "/admin/quotes", icon: FileText },
  { label: "Tracking", href: "/admin/tracking", icon: Eye },
  { label: "Emails", href: "/admin/emails", icon: Mail },
];

const bottomItems: NavItem[] = [
  { label: "Configuracion", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export function AdminSidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5">
        <Link href="/admin" className="text-xl font-bold tracking-tight">
          LX3<span className="text-blue-400">.ai</span>
        </Link>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-l-2 border-blue-500 bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Separator + bottom items */}
      <div className="border-t border-gray-700 px-3 py-4">
        {bottomItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "border-l-2 border-blue-500 bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
