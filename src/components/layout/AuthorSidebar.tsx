"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileEdit,
  PlusCircle,
  BarChart2,
  DollarSign,
  User,
} from "lucide-react";

export default function AuthorSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Mi Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/stories/new", label: "Nueva Historia", icon: PlusCircle },
    { href: "/dashboard/stories", label: "Mis Historias", icon: FileEdit },
    { href: "/dashboard/analytics", label: "Mis Estadísticas", icon: BarChart2 },
    { href: "/dashboard/revenue", label: "Mis Ingresos", icon: DollarSign },
    { href: "/dashboard/profile", label: "Mi Perfil & Avatar", icon: User },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-[calc(100vh-4rem)] p-4 space-y-6 flex-shrink-0">
      <div className="px-3.5 py-2.5 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 rounded-2xl text-brand-600 dark:text-brand-300 text-xs font-bold uppercase tracking-wider">
        Portal de Autor
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
                  ? "bg-gradient-to-r from-brand-500 to-brand-800 text-white shadow-sm"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
