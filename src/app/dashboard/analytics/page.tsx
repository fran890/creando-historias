import { getCurrentUser } from "@/lib/auth";
import { getAuthorAnalytics } from "@/services/analytics.service";
import { Eye, BookOpen, BarChart } from "lucide-react";

export default async function AuthorAnalyticsPage() {
  const user = (await getCurrentUser())!;
  const analytics = await getAuthorAnalytics(user.userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">Estadísticas de Tráfico</h1>
        <p className="text-sm text-gray-500">Métricas detalladas de lecturas de tus artículos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Total de Lecturas acumuladas</span>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{analytics.totalViews.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Historias Publicadas</span>
          <p className="text-3xl font-black text-blue-600">{analytics.publishedCount}</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Promedio de vistas por historia</span>
          <p className="text-3xl font-black text-emerald-600">
            {analytics.publishedCount > 0 ? Math.round(analytics.totalViews / analytics.publishedCount) : 0}
          </p>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4">
        <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">Rendimiento por Publicación</h2>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {analytics.topArticles.map((art) => (
            <div key={art.id} className="py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{art.title}</span>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>{art.viewCount} vistas</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
