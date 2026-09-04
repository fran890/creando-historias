import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-brand-500 font-bold text-xs uppercase tracking-wider">
          <Cookie className="w-4 h-4" />
          <span>Informacion de Cookies</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          Politica de Cookies
        </h1>
        <p className="text-xs text-gray-400 font-medium">Ultima actualizacion: Agosto 2026</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">1. Que son las cookies?</h2>
          <p>
            Las cookies son pequenos archivos de texto que se almacenan en tu dispositivo al visitar sitios web para recordar tus preferencias y mejorar la experiencia de navegacion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">2. Cookies de publicidad de terceros</h2>
          <p>
            Proveedores publicitarios como Google AdSense y Adsterra pueden utilizar cookies, identificadores anonimos y scripts externos para publicar anuncios, limitar la frecuencia, medir el rendimiento y detectar actividad no valida.
          </p>
        </section>
      </div>
    </div>
  );
}
