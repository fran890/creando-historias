import Link from "next/link";
import { BookOpen, Heart, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#05080f] text-gray-400 border-t border-gray-800/80 mt-20 relative overflow-hidden">
      {/* Background Radial Glow Accent */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-500 via-brand-600 to-brand-800 text-white flex items-center justify-center shadow-glow">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                Creando<span className="gradient-text">Historias</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
              Plataforma editorial abierta donde los creadores comparten conocimiento, historias fascinantes y reflexiones inspiradoras. Publicaciones de alta calidad con atribución transparente de ingresos.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/60 text-brand-300 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Experiencia Editorial Premium</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-white font-display text-xs font-bold tracking-wider uppercase">Explorar</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-brand-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-brand-400 transition-colors">
                  Buscar historias
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators Portal Column */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-white font-display text-xs font-bold tracking-wider uppercase">Creadores & Autores</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/dashboard" className="hover:text-brand-400 transition-colors">
                  Portal de Autores / Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-400 transition-colors">
                  Acceso de Creadores
                </Link>
              </li>
              <li>
                <Link href="/dashboard/stories/new" className="hover:text-brand-400 transition-colors">
                  Publicar nueva historia
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-white font-display text-xs font-bold tracking-wider uppercase">Legal & Privacidad</h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/privacy" className="hover:text-brand-400 transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-400 transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-brand-400 transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Contacto & Soporte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Metadata Bar */}
        <div className="border-t border-gray-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} CreandoHistorias. Todos los derechos reservados.</p>
          <p className="flex items-center space-x-1">
            <span>Diseñado con</span>
            <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
            <span>para creadores y lectores.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
