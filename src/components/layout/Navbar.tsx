import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BookOpen, Shield, PenTool, LogOut, Search } from "lucide-react";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Creando<span className="text-brand-500">Historias</span>
          </span>
        </Link>

        {/* Search & Navigation Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/search"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Buscar historias"
          >
            <Search className="w-5 h-5" />
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-200 transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-800 text-white hover:opacity-90 transition shadow-sm"
              >
                <PenTool className="w-4 h-4" />
                <span>Escribir / Dashboard</span>
              </Link>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-xs font-semibold px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
