import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-brand-500 font-bold text-xs uppercase tracking-wider">
          <Cookie className="w-4 h-4" />
          <span>Información de Cookies</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          Política de Cookies
        </h1>
        <p className="text-xs text-gray-400 font-medium">Última actualización: Agosto 2026</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo al visitar sitios web para recordar tus preferencias y mejorar la experiencia de navegación.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">2. Cookies de Google AdSense</h2>
          <p>
            Google, como proveedor asociado, utiliza cookies para publicar anuncios en este sitio web. Los usuarios pueden inhabilitar la publicidad personalizada visitando la Configuración de anuncios de Google.
          </p>
        </section>
      </div>
    </div>
  );
}
