"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
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
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ThemeToggle } from "./ThemeToggle";

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
  { label: "Configuración", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

function NavLink({
  item,
  active,
  collapsed,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClose: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClose}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        collapsed && "justify-center px-0",
        active
          ? "bg-blue-600/10 text-blue-600 dark:text-blue-400"
          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200"
      )}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r bg-blue-500" />
      )}
      <item.icon className={cn("h-5 w-5 shrink-0", active && "text-blue-600 dark:text-blue-400")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-2 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
          {item.label}
        </span>
      )}
    </Link>
  );
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  onClose,
  user,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div
        className={cn(
          "flex h-16 items-center shrink-0 border-b border-zinc-200 dark:border-zinc-800",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <Link href="/admin" className="flex items-center gap-2 overflow-hidden">
          {collapsed ? (
            <img
              src="/logo/LX3_isotipo.svg"
              alt="LX3"
              width={28}
              height={28}
              className="h-7 w-7"
            />
          ) : (
            <>
              <img
                src="/logo/LX3_logotipo_dark-bg.svg"
                alt="LX3"
                width={96}
                height={28}
                className="hidden dark:block h-7 w-auto"
              />
              <img
                src="/logo/LX3_logotipo_light-bg.svg"
                alt="LX3"
                width={96}
                height={28}
                className="block dark:hidden h-7 w-auto"
              />
            </>
          )}
        </Link>

        {/* Close button on mobile */}
        <button
          onClick={onClose}
          className="rounded-md p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-1 py-4 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
            onClose={onClose}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className={cn("border-t border-zinc-200 dark:border-zinc-800 py-3 space-y-1", collapsed ? "px-2" : "px-3")}>
        {/* Theme toggle */}
        <div className={cn("flex", collapsed ? "justify-center" : "px-1 mb-1")}>
          <ThemeToggle collapsed={collapsed} />
        </div>

        {/* Settings */}
        {bottomItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            collapsed={collapsed}
            onClose={onClose}
          />
        ))}

        {/* User & sign out */}
        {!collapsed && user && (
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 mt-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {user.name ?? "Admin"}
              </p>
              <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              title="Cerrar sesion"
              className="rounded-md p-1.5 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}

        {collapsed && (
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title="Cerrar sesion"
            className="flex w-full items-center justify-center rounded-lg py-2.5 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg py-2 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mt-1"
          title={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span className="text-xs">Contraer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
