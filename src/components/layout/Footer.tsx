import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl font-black tracking-tight text-white">
                Creando<span className="text-brand-500">Historias</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              Descubre las mejores publicaciones y las historias más interesantes escritas por autores apasionados. Conocimiento, inspiración y relatos fascinantes en un solo lugar.
            </p>
          </div>

          <div>
            <h3 className="text-white text-xs font-bold mb-4 tracking-wider uppercase">Explorar</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-brand-500 transition">Inicio</Link></li>
              <li><Link href="/search" className="hover:text-brand-500 transition">Buscar historias</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-bold mb-4 tracking-wider uppercase">Plataforma</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-brand-500 transition">Portal de Autores</Link></li>
              <li><Link href="/login" className="hover:text-brand-500 transition">Acceso Autores</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-xs font-bold mb-4 tracking-wider uppercase">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-brand-500 transition">Política de Privacidad</Link></li>
              <li><Link href="/terms" className="hover:text-brand-500 transition">Términos y Condiciones</Link></li>
              <li><Link href="/cookies" className="hover:text-brand-500 transition">Política de Cookies</Link></li>
              <li><Link href="/contact" className="hover:text-brand-500 transition">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CreandoHistorias. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
