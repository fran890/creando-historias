import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getAuthorAnalytics } from "@/services/analytics.service";
import { calculateAuthorEstimatedRevenue } from "@/services/revenue.service";
import { Eye, FileText, Clock, DollarSign, PlusCircle, CheckCircle, AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const user = (await getCurrentUser())!;
  const analytics = await getAuthorAnalytics(user.userId);
  const revenue = await calculateAuthorEstimatedRevenue(user.userId);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
            ¡Hola de nuevo, {user.name}! 👋
          </h1>
          <p className="text-sm text-gray-500">Bienvenido al portal editorial. Aquí tienes el resumen de tu contenido e ingresos.</p>
        </div>
        <Link
          href="/dashboard/stories/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition shadow-sm flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Nueva Historia</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Visitas Totales</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Ingresos Estimados</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-black text-emerald-600">${revenue.authorShareAmount.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Atribuido al autor ({revenue.authorSharePercentage}%)</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Publicadas</span>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics.publishedCount}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>Pendientes / Borradores</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics.pendingCount + analytics.draftCount}</p>
        </div>
      </div>

      {/* Top Articles Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Tus publicaciones con mayor tráfico</h2>
        {analytics.topArticles.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Aún no tienes historias publicadas.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {analytics.topArticles.map((art) => (
              <div key={art.id} className="py-3 flex items-center justify-between">
                <Link href={`/stories/${art.slug}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 truncate max-w-lg">
                  {art.title}
                </Link>
                <div className="flex items-center space-x-2 text-xs font-medium text-gray-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{art.viewCount} vistas</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
