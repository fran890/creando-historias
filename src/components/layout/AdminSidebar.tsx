"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  FolderTree,
  Tag,
  BarChart3,
  DollarSign,
  Settings,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/stories", label: "Moderación", icon: FileText },
    { href: "/admin/users", label: "Usuarios", icon: Users },
    { href: "/admin/authors", label: "Autores", icon: UserCheck },
    { href: "/admin/categories", label: "Categorías", icon: FolderTree },
    { href: "/admin/tags", label: "Etiquetas", icon: Tag },
    { href: "/admin/analytics", label: "Analítica", icon: BarChart3 },
    { href: "/admin/revenue", label: "Ingresos", icon: DollarSign },
    { href: "/admin/settings", label: "Configuración", icon: Settings },
  ];

  const activeLink = links.find((l) => l.href === pathname) || links[0];
  const ActiveIcon = activeLink.icon;

  return (
    <>
      {/* Mobile Sticky Navigation Bar (< lg screens) */}
      <div className="lg:hidden sticky top-16 z-40 w-full bg-gray-900/98 backdrop-blur-md border-b border-gray-800 px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3 text-gray-500" />
              <span className="text-blue-400 flex items-center space-x-1">
                <ActiveIcon className="w-3.5 h-3.5 inline mr-1" />
                {activeLink.label}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-gray-300 hover:text-white rounded-lg bg-gray-800 border border-gray-700 transition"
          aria-label="Abrir menú de administración"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden sticky top-[6.25rem] z-40 bg-gray-900 border-b border-gray-800 p-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2">
            Secciones del Panel
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 p-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-gray-800/80 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Vertical Sidebar (>= lg screens) */}
      <aside className="hidden lg:block w-64 bg-gray-900 text-gray-300 min-h-[calc(100vh-4rem)] p-4 space-y-6 flex-shrink-0 border-r border-gray-800">
        <div className="flex items-center space-x-2.5 px-3.5 py-2.5 bg-amber-950/60 border border-amber-800/50 rounded-2xl text-amber-300 text-xs font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Panel Admin</span>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "hover:bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
