import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminStoryActions from "./AdminStoryActions";
import { PlusCircle, ShieldAlert, CheckCircle2, Clock, FileText } from "lucide-react";

export default async function AdminStoriesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: { select: { name: true, username: true, role: true } },
      category: { select: { name: true } },
    },
  });

  const pendingArticles = articles.filter((a) => a.status === "PENDING_REVIEW");
  const publishedArticles = articles.filter((a) => a.status === "PUBLISHED");
  const draftArticles = articles.filter((a) => a.status === "DRAFT");
  const rejectedArticles = articles.filter((a) => a.status === "REJECTED");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-black text-white">Panel de Moderación de Historias</h1>
          <p className="text-sm text-gray-400">
            Supervisa las publicaciones. Las historias en borrador requieren que el autor las envíe a revisión antes de poder publicarse.
          </p>
        </div>
        <Link
          href="/dashboard/stories/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-800 hover:opacity-90 text-white text-xs font-bold rounded-2xl transition shadow flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Historia como Admin</span>
        </Link>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-2xl flex items-center space-x-3">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <div>
            <div className="text-2xl font-bold text-amber-300">{pendingArticles.length}</div>
            <div className="text-[11px] font-semibold text-amber-400">Por Moderar (Pendientes)</div>
          </div>
        </div>

        <div className="p-4 bg-green-950/40 border border-green-800/60 rounded-2xl flex items-center space-x-3">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
          <div>
            <div className="text-2xl font-bold text-green-300">{publishedArticles.length}</div>
            <div className="text-[11px] font-semibold text-green-400">Publicadas</div>
          </div>
        </div>

        <div className="p-4 bg-gray-800/60 border border-gray-700 rounded-2xl flex items-center space-x-3">
          <Clock className="w-6 h-6 text-gray-400" />
          <div>
            <div className="text-2xl font-bold text-gray-200">{draftArticles.length}</div>
            <div className="text-[11px] font-semibold text-gray-400">En Borrador (No listas)</div>
          </div>
        </div>

        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl flex items-center space-x-3">
          <FileText className="w-6 h-6 text-red-400" />
          <div>
            <div className="text-2xl font-bold text-red-300">{rejectedArticles.length}</div>
            <div className="text-[11px] font-semibold text-red-400">Rechazadas</div>
          </div>
        </div>
      </div>

      {/* Section 1: Pending Moderation Stories (Primary Focus) */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-gray-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h2 className="font-serif text-xl font-bold text-white">Historias Pendientes de Revisión</h2>
        </div>

        {pendingArticles.length === 0 ? (
          <div className="p-8 text-center bg-gray-900/60 rounded-3xl border border-dashed border-gray-800 text-gray-400 text-xs">
            No hay historias pendientes de revisión en este momento.
          </div>
        ) : (
          <div className="divide-y divide-gray-800 bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-sm">
            {pendingArticles.map((art) => (
              <div key={art.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-semibold text-brand-400">Por {art.author.name} ({art.author.role})</span>
                    <span className="text-gray-600">&bull;</span>
                    {art.category && <span className="text-gray-400 font-medium">{art.category.name}</span>}
                    <span className="text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      PENDIENTE DE REVISIÓN
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white hover:text-brand-400 transition">
                    <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                  </h3>
                  {art.excerpt && <p className="text-xs text-gray-400 line-clamp-2">{art.excerpt}</p>}
                </div>

                <AdminStoryActions articleId={art.id} currentStatus={art.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section 2: All Other Stories List */}
      <section className="space-y-4 pt-4">
        <div className="border-b border-gray-800 pb-3">
          <h2 className="font-serif text-xl font-bold text-white">Todas las Historias en la Plataforma</h2>
        </div>

        <div className="divide-y divide-gray-800 bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-sm">
          {articles.map((art) => (
            <div key={art.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-semibold text-gray-400">Por {art.author.name}</span>
                  <span className="text-gray-600">&bull;</span>
                  {art.category && <span className="text-gray-400">{art.category.name}</span>}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      art.status === "PUBLISHED"
                        ? "bg-green-950/80 text-green-400 border border-green-800"
                        : art.status === "DRAFT"
                        ? "bg-gray-800 text-gray-400 border border-gray-700"
                        : art.status === "PENDING_REVIEW"
                        ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                        : "bg-red-950/80 text-red-400 border border-red-800"
                    }`}
                  >
                    {art.status}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold text-gray-200 hover:text-white transition">
                  <Link href={`/stories/${art.slug}`}>{art.title}</Link>
                </h3>
              </div>

              <AdminStoryActions articleId={art.id} currentStatus={art.status} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
