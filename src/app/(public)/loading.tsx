import { Loader2 } from "lucide-react";

export default function GlobalPublicLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center space-y-4 min-h-[50vh]">
      <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center animate-pulse">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
        Cargando contenido...
      </p>
    </div>
  );
}
