import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="border-b border-gray-200 dark:border-gray-800 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-brand-500 font-bold text-xs uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Terminos y Condiciones</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
          Terminos de Servicio
        </h1>
        <p className="text-xs text-gray-400 font-medium">Ultima actualizacion: Agosto 2026</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-sans shadow-xs">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">1. Aceptacion de los Terminos</h2>
          <p>
            Al acceder a la plataforma Creando-Historias, aceptas cumplir con estos terminos y condiciones. Si no estas de acuerdo con alguna parte, no debes utilizar nuestros servicios.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">2. Propiedad Intelectual de Autores</h2>
          <p>
            Los autores conservan la propiedad total de sus publicaciones. Al publicar en nuestra plataforma, conceden una licencia no exclusiva para mostrar su contenido a los lectores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">3. Conducta del Usuario</h2>
          <p>
            Queda estrictamente prohibida la publicacion de contenido difamatorio, plagios, material ilegal o contenido que viole las politicas de nuestros proveedores de publicidad de terceros.
          </p>
        </section>
      </div>
    </div>
  );
}
