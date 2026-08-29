import Metadata from "next";
import Link from "next/link";
import { Sparkles, BookOpen, Users, DollarSign, ShieldCheck, Heart, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sobre Nosotros | Creando-Historias",
  description: "Conoce más sobre Creando-Historias, nuestra misión editorial, valores y cómo apoyamos a los creadores de contenido.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-500 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nuestra Historia & Misión</span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
          Sobre <span className="gradient-text">Creando-Historias</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
          Somos una plataforma editorial moderna construida para conectar creadores apasionados con lectores curiosos, promoviendo contenido de alta calidad y monetización justa.
        </p>
      </div>

      {/* Grid of Values / Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs hover:border-brand-500/50 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Lectura de Alta Calidad</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            Priorizamos la experiencia de lectura con una tipografía cuidada, diseños limpios y contenido relevante libre de distorsiones visuales.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs hover:border-brand-500/50 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-500">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Ingresos Transparentes</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            Ofrecemos atribución directa y justa de ingresos publicitarios para los autores, recompensando el impacto de cada publicación.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-4 shadow-xs hover:border-brand-500/50 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-500">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Comunidad de Creadores</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            Un espacio donde la diversidad de opiniones, la innovación técnica y la narrativa creativa encuentran su audiencia ideal.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="bg-gradient-to-br from-brand-900 via-gray-900 to-black text-white rounded-3xl p-8 sm:p-12 space-y-6 relative overflow-hidden border border-brand-800/40">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 max-w-2xl relative z-10">
          <h2 className="font-display text-2xl sm:text-4xl font-bold">
            ¿Por qué creamos esta plataforma?
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed font-sans">
            Creando-Historias nació de la visión de simplificar la publicación digital sin comprometer el valor editorial ni la privacidad. Creemos en un ecosistema abierto donde cada voz tenga el alcance que merece y las herramientas adecuadas para hacer crecer su audiencia.
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-brand-300">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            <span>Compromiso de privacidad y libertad de expresión</span>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow transition"
          >
            <span>Contáctanos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Footer Callout */}
      <div className="text-center space-y-4">
        <p className="text-xs text-gray-500 font-medium flex items-center justify-center space-x-1">
          <span>Impulsando historias reales con</span>
          <Heart className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
          <span>para la comunidad global.</span>
        </p>
      </div>
    </div>
  );
}
