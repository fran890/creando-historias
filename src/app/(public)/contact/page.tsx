"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, Sparkles, CheckCircle2, Copy, ExternalLink, Loader2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const emailAddress = "soporte@creando-historias.com";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(
    formData.subject || `Consulta de ${formData.name || "Contacto"}`
  )}&body=${encodeURIComponent(
    `Nombre: ${formData.name}\nCorreo: ${formData.email}\n\nMensaje:\n${formData.message}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar el mensaje.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Ocurrió un problema inesperado. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitted(false);
    setError(null);
  };

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
        {/* Info Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 rounded-3xl p-8 text-white space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Creando-Historias</h2>
            <p className="text-xs opacity-90 leading-relaxed">
              Atención personalizada a nuestros creadores de contenido, autores y lectores.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/20 text-xs font-semibold">
            {/* Interactive Email Box */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="opacity-70 text-[10px] uppercase tracking-wider">Email Oficial</p>
                  <a
                    href={`mailto:${emailAddress}`}
                    className="text-sm font-bold hover:underline hover:text-brand-200 transition break-all flex items-center space-x-1"
                    title="Enviar correo directo"
                  >
                    <span>{emailAddress}</span>
                  </a>
                </div>
              </div>

              {/* Action buttons for email */}
              <div className="flex items-center space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-medium transition flex items-center space-x-1.5"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-green-300" />
                      <span className="text-green-300">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${emailAddress}`}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-medium transition flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Abrir cliente</span>
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="opacity-70 text-[10px] uppercase tracking-wider">Respuesta estimada</p>
                <p className="text-sm font-bold">Menos de 24 horas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xs space-y-4">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Gracias por escribirnos. Tu mensaje ha sido enviado a{" "}
                  <strong className="text-brand-500">{emailAddress}</strong>. Te responderemos a la brevedad posible.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <a
                  href={mailtoLink}
                  className="w-full sm:w-auto px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-glow transition flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Enviar desde tu app de correo</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition"
                >
                  Enviar otro mensaje
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Envíanos un mensaje</h3>
              
              {error && (
                <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Asunto
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Consulta sobre publicación / ingresos"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                    Mensaje *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escribe tu consulta aquí..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-glow transition flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando mensaje...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar mensaje a {emailAddress}</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
