import Link from "next/link";
import { getGlobalAnalytics } from "@/services/analytics.service";
import { getGlobalRevenueSummary } from "@/services/revenue.service";
import { Users, FileText, Eye, DollarSign, AlertCircle, ShieldCheck, UserCheck } from "lucide-react";

export default async function AdminDashboardPage() {
  const analytics = await getGlobalAnalytics();
  const revenue = await getGlobalRevenueSummary();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-white">Panel de Control Administrativo</h1>
        <p className="text-sm text-gray-400">Monitoreo global de usuarios, contenido, tráfico e ingresos estimativos.</p>
      </div>

      {/* Global Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Visitas Totales Plataforma</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white">{analytics.totalViews.toLocaleString()}</p>
        </div>

        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Ingresos Estimados Brutos</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">${revenue.grossEstimatedRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-400">
            Plataforma: ${revenue.totalPlatformShare.toFixed(2)} ({revenue.settings.platformSharePercentage}%)
          </p>
        </div>

        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Pendientes de Revisión</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400">{analytics.pendingArticles}</p>
          <Link href="/admin/stories" className="text-xs text-amber-300 hover:underline">
            Ver cola de moderación &rarr;
          </Link>
        </div>

        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Autores / Usuarios</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white">{analytics.totalAuthors} / {analytics.totalUsers}</p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Articles */}
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-4">
          <h2 className="font-serif text-lg font-bold text-white">Publicaciones Más Vistas</h2>
          <div className="divide-y divide-gray-800">
            {analytics.topArticles.map((art) => (
              <div key={art.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link href={`/stories/${art.slug}`} className="text-sm font-semibold text-white hover:text-blue-400">
                    {art.title}
                  </Link>
                  <p className="text-xs text-gray-400">Autor: {art.author.name}</p>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400 font-bold">
                  <Eye className="w-3.5 h-3.5 text-blue-400" />
                  <span>{art.viewCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Authors */}
        <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-4">
          <h2 className="font-serif text-lg font-bold text-white">Autores Destacados</h2>
          <div className="divide-y divide-gray-800">
            {analytics.topAuthors.map((author) => (
              <div key={author.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link href={`/author/${author.username}`} className="text-sm font-semibold text-white hover:text-blue-400">
                    {author.name}
                  </Link>
                  <p className="text-xs text-gray-400">@{author.username}</p>
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  {author._count.articles} publicaciones
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
