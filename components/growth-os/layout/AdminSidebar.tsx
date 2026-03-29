"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  Kanban,
  FileText,
  Eye,
  Mail,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Contactos", href: "/admin/contacts", icon: Users },
  { label: "Empresas", href: "/admin/companies", icon: Building2 },
  { label: "Pipeline", href: "/admin/deals", icon: Kanban },
  { label: "Cotizaciones", href: "/admin/quotes", icon: FileText },
  { label: "Tracking", href: "/admin/tracking", icon: Eye },
  { label: "Emails", href: "/admin/emails", icon: Mail },
];

const bottomNav: NavItem[] = [
  { label: "Configuración", href: "/admin/settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

function SidebarContent({
  collapsed,
  onToggle,
  pathname,
}: {
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-gray-200 dark:border-zinc-800 px-4",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">LX3</span>
          {!collapsed && (
            <span className="text-sm font-medium text-gray-500 dark:text-zinc-500">Growth OS</span>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {mainNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            active={isActive(pathname, item.href)}
          />
        ))}
      </nav>

      {/* Separator + bottom nav */}
      <div className="border-t border-gray-200 dark:border-zinc-800 px-3 py-4">
        {bottomNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            active={isActive(pathname, item.href)}
          />
        ))}
      </div>

      {/* Collapse toggle */}
      <div className="hidden border-t border-gray-200 dark:border-zinc-800 p-3 lg:block">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-in-out lg:block dark:border-zinc-800 dark:bg-zinc-900",
          collapsed ? "w-16" : "w-[280px]"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={onToggle}
          pathname={pathname}
        />
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-gray-200 bg-white lg:hidden dark:border-zinc-800 dark:bg-zinc-900"
            >
              <button
                onClick={onMobileClose}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent
                collapsed={false}
                onToggle={onToggle}
                pathname={pathname}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
