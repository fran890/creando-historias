import { Mail, MessageSquare, Send, Sparkles } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-500 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Soporte & Consultas Editorial</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">
          Contacto
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          ¿Tienes preguntas sobre la plataforma, dudas sobre ingresos o sugerencias editoriales? Nuestro equipo está para ayudarte.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-3xl p-8 text-white space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Creando-Historias</h2>
            <p className="text-xs opacity-90 leading-relaxed">
              Atención personalizada a nuestros creadores de contenido, autores y lectores.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/20 text-xs font-semibold">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="opacity-70 text-[10px] uppercase tracking-wider">Email Oficial</p>
                <p className="text-sm font-bold">soporte@creando-historias.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="opacity-70 text-[10px] uppercase tracking-wider">Respuesta estimada</p>
                <p className="text-sm font-bold">Menos de 24 horas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
          <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Envíanos un mensaje</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Tu Nombre</label>
              <input
                type="text"
                placeholder="Juan Pérez"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">Mensaje</label>
              <textarea
                rows={4}
                placeholder="Escribe tu consulta aquí..."
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              type="button"
              className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-2xl shadow-glow transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar mensaje</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
