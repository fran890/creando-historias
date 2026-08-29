"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Shield, PenTool, LogOut, Search, Menu, X, User, Sparkles } from "lucide-react";
import { AuthSession } from "@/lib/auth";

interface NavbarClientProps {
  user: AuthSession | null;
  hydrateSession?: boolean;
}

export default function NavbarClient({ user, hydrateSession = false }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!hydrateSession || user) return;

    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, [hydrateSession, user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        redirect: "manual",
      });
    } finally {
      setCurrentUser(null);
      window.location.href = "/";
    }
  };

  return (
    <header className="site-header sticky top-0 z-50 bg-white dark:bg-[#090d16] border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-900 border border-brand-100 dark:border-brand-900/60 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img src="/logo-sin-fondo.png" alt="Creando-Historias" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Creando-<span className="gradient-text">Historias</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            href="/search"
            prefetch={false}
            className="p-2.5 text-gray-600 dark:text-gray-300 hover:text-brand-500 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition"
            title="Buscar historias"
          >
            <Search className="w-4 h-4" />
          </Link>

          {currentUser ? (
            <div className="flex items-center space-x-3">
              {currentUser.role === "ADMIN" && (
                <Link
                  href="/admin"
                  prefetch={false}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-2xl bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition shadow-xs"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                prefetch={false}
                className="inline-flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 text-white hover:opacity-95 transition shadow-glow active:scale-95"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800/60 transition disabled:opacity-60"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              prefetch={false}
              className="inline-flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-800 text-white hover:opacity-95 transition shadow-glow active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acceso Autores</span>
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
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60"
            >
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span>Inicio</span>
            </Link>

            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60"
            >
              <Search className="w-4 h-4 text-brand-500" />
              <span>Buscar historias</span>
            </Link>

            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                >
                  <PenTool className="w-4 h-4 text-brand-500" />
                  <span>Portal de Autor / Dashboard</span>
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                >
                  <User className="w-4 h-4 text-brand-500" />
                  <span>Mi Perfil & Avatar</span>
                </Link>

                {currentUser.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Panel de Administración</span>
                  </Link>
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-60"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión ({currentUser.name})</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 bg-gradient-to-r from-brand-500 to-brand-800 text-white font-bold text-sm rounded-2xl shadow-glow"
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
