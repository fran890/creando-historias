import { getGlobalRevenueSummary } from "@/services/revenue.service";
import { DollarSign, Info } from "lucide-react";

export default async function AdminRevenuePage() {
  const revenue = await getGlobalRevenueSummary();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Ingresos & Atribución Global</h1>
        <p className="text-sm text-gray-400">Control total de estimaciones publicitarias y distribución de beneficios.</p>
      </div>

      <div className="p-4 rounded-2xl bg-blue-950/60 border border-blue-800 text-blue-300 text-xs flex items-start space-x-3">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>
          Distinción clara: Los datos reflejan <strong>Ingresos Estimados</strong> basados en el tráfico de lecturas y un modelo RPM desacoplado listo para integrar reportes reales de AdSense.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Bruto Estimado Total</span>
          <p className="text-4xl font-black text-emerald-400">${revenue.grossEstimatedRevenue.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Reparto Autores ({revenue.settings.authorSharePercentage}%)</span>
          <p className="text-4xl font-black text-white">${revenue.totalAuthorShare.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Ganancia Plataforma ({revenue.settings.platformSharePercentage}%)</span>
          <p className="text-4xl font-black text-blue-400">${revenue.totalPlatformShare.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
