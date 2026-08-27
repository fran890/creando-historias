import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-brand-500 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Legal & Privacidad</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          Política de Privacidad
        </h1>
        <p className="text-xs text-gray-400 font-medium">Última actualización: Agosto 2026</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">1. Información que recopilamos</h2>
          <p>
            En Creando-Historias recopilamos información técnica mínima necesaria para ofrecer una experiencia de lectura fluida y realizar analíticas anónimas de tráfico. Esto incluye tipo de dispositivo, país de origen y páginas visitadas.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">2. Uso de cookies y publicidad</h2>
          <p>
            Utilizamos servicios de publicidad de terceros como Google AdSense. Google utiliza cookies para publicar anuncios basados en las visitas previas del usuario a este u otros sitios web.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">3. Protección de datos del usuario</h2>
          <p>
            La información de autores y creadores se almacena de forma segura y nunca se comparte con terceros sin su consentimiento explícito.
          </p>
        </section>
      </div>
    </div>
  );
}
