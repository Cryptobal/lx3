"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

const EXPANDED = 256;
const COLLAPSED = 72;

interface SidebarContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggleCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin-sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      localStorage.setItem("admin-sidebar-collapsed", String(!prev));
      return !prev;
    });
  }

  const sidebarWidth = collapsed ? COLLAPSED : EXPANDED;

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
      <div className="flex min-h-[100dvh] bg-zinc-50 dark:bg-[var(--bg-deep)]">
        {/* Desktop sidebar spacer */}
        <div
          className="hidden lg:block shrink-0 transition-[width] duration-300 ease-in-out"
          style={{ width: mounted ? sidebarWidth : EXPANDED }}
        />

        {/* Desktop sidebar — fixed position */}
        <aside
          className="fixed inset-y-0 left-0 z-30 hidden lg:flex lg:flex-col transition-[width] duration-300 ease-in-out"
          style={{ width: mounted ? sidebarWidth : EXPANDED }}
        >
          <AdminSidebar
            collapsed={collapsed}
            onToggleCollapse={toggleCollapsed}
            onClose={() => setMobileOpen(false)}
            user={user}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: -EXPANDED }}
                animate={{ x: 0 }}
                exit={{ x: -EXPANDED }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              >
                <AdminSidebar
                  collapsed={false}
                  onToggleCollapse={toggleCollapsed}
                  onClose={() => setMobileOpen(false)}
                  user={user}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0">
          <AdminTopbar
            onMenuToggle={() => setMobileOpen((prev) => !prev)}
            user={user}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
