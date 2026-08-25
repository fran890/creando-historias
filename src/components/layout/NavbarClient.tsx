"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Shield, PenTool, LogOut, Search, Menu, X, User } from "lucide-react";
import { AuthSession } from "@/lib/auth";

interface NavbarClientProps {
  user: AuthSession | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Creando<span className="text-brand-500">Historias</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/search"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Buscar historias"
          >
            <Search className="w-5 h-5" />
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-200 transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-800 text-white hover:opacity-90 transition shadow-xs"
              >
                <PenTool className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition shadow-xs"
            >
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Mobile Search & Hamburger Menu Actions */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            href="/search"
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Buscar historias"
          >
            <Search className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 dark:text-gray-200 hover:text-brand-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Menú principal"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span>Inicio</span>
            </Link>

            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Search className="w-4 h-4 text-brand-500" />
              <span>Buscar historias</span>
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <PenTool className="w-4 h-4 text-brand-500" />
                  <span>Portal de Autor / Dashboard</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User className="w-4 h-4 text-brand-500" />
                  <span>Mi Perfil & Avatar</span>
                </Link>

                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Panel de Administración</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <form action="/api/auth/logout" method="POST">
                    <button
                      type="submit"
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión ({user.name})</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-gradient-to-r from-brand-500 to-brand-800 text-white font-bold text-sm rounded-xl shadow-xs"
                >
                  Iniciar sesión
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
