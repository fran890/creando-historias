import { getCurrentUser } from "@/lib/auth";
import { calculateAuthorEstimatedRevenue } from "@/services/revenue.service";
import { DollarSign, AlertCircle, TrendingUp, Info } from "lucide-react";

export default async function AuthorRevenuePage() {
  const user = (await getCurrentUser())!;
  const revenue = await calculateAuthorEstimatedRevenue(user.userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Ingresos Atribuidos</h1>
        <p className="text-sm text-gray-500">Estimación transparente de ingresos publicitarios correspondientes a tu contenido.</p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3 text-amber-800 dark:text-amber-300 text-xs">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Nota de Monetización:</strong> Los montos mostrados son <em>Ingresos Estimados</em> calculados en función de las reproducciones y el porcentaje de reparto configurado por la plataforma ({revenue.authorSharePercentage}% para el autor / {revenue.platformSharePercentage}% para la plataforma).
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Tus Ingresos Estimados ({revenue.authorSharePercentage}%)</span>
          <p className="text-4xl font-black text-emerald-600">${revenue.authorShareAmount.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Ingresos Brutos Estimados</span>
          <p className="text-3xl font-black text-gray-900 dark:text-white">${revenue.grossEstimatedRevenue.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Comisión Plataforma ({revenue.platformSharePercentage}%)</span>
          <p className="text-3xl font-black text-gray-500">${revenue.platformShareAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
