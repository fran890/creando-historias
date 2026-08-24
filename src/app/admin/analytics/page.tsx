import { getGlobalAnalytics } from "@/services/analytics.service";
import { Eye, Users, BookOpen } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const analytics = await getGlobalAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white">Analítica Global</h1>
        <p className="text-sm text-gray-400">Resumen consolidado de audiencia y publicaciones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Total Vistas Registradas</span>
          <p className="text-4xl font-black text-blue-400">{analytics.totalViews.toLocaleString()}</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Publicaciones en Vivo</span>
          <p className="text-4xl font-black text-green-400">{analytics.publishedArticles}</p>
        </div>
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <span className="text-xs text-gray-400 font-semibold">Autores Activos</span>
          <p className="text-4xl font-black text-purple-400">{analytics.totalAuthors}</p>
        </div>
      </div>
    </div>
  );
}
