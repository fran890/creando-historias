"use client";

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
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

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

  return (
    <>
      {/* Mobile Horizontal Navigation Bar (< lg screens) */}
      <div className="lg:hidden w-full bg-gray-900 border-b border-gray-800 p-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-2 min-w-max">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Sidebar (>= lg screens) */}
      <aside className="hidden lg:block w-64 bg-gray-900 text-gray-300 min-h-[calc(100vh-4rem)] p-4 space-y-6 flex-shrink-0">
        <div className="flex items-center space-x-2 px-3 py-2 bg-amber-950/60 border border-amber-800/50 rounded-xl text-amber-300 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Panel de Administración</span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
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
