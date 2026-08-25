"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DollarSign,
  Calendar,
  Eye,
  Percent,
  User,
  ArrowUpRight,
  TrendingUp,
  Download,
  Info,
  Sliders,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";
import { MonthlyRevenueReport } from "@/services/revenue.service";

interface AdminRevenueReportClientProps {
  report: MonthlyRevenueReport;
  periods: Array<{ year: number; month: number; label: string }>;
}

export default function AdminRevenueReportClient({ report, periods }: AdminRevenueReportClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPeriod, setSelectedPeriod] = useState(
    `${report.year}-${report.month}`
  );
  const [rpmInput, setRpmInput] = useState(report.rpmEstimate.toString());

  const handlePeriodChange = (val: string) => {
    setSelectedPeriod(val);
    const [y, m] = val.split("-");
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", y);
    params.set("month", m);
    router.push(`/admin/revenue?${params.toString()}`);
  };

  const handleRpmUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("rpm", rpmInput);
    router.push(`/admin/revenue?${params.toString()}`);
  };

  const exportCSV = () => {
    const headers = ["Autor", "Username", "Rol", "Artículos Mes", "Vistas Mes", "% Autor", "% Admin", "Ganancia Bruta", "Pago Autor ($)", "Ganancia Admin ($)"];
    const rows = report.authors.map((a) => [
      `"${a.name}"`,
      `"${a.username}"`,
      a.role,
      a.articlesCount,
      a.monthlyViews,
      `${a.authorSharePct}%`,
      `${a.platformSharePct}%`,
      `$${a.grossRevenue.toFixed(2)}`,
      `$${a.authorShareAmount.toFixed(2)}`,
      `$${a.platformShareAmount.toFixed(2)}`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Ingresos_${report.monthName.replace(" ", "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-white">
              Reporte de Ingresos & Cortes Mensuales
            </h1>
            {report.isCurrentMonth ? (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-950 text-blue-400 border border-blue-800 rounded-full animate-pulse">
                Mes en Curso
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-gray-800 text-gray-300 border border-gray-700 rounded-full">
                Corte Histórico
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Desglose detallado por autor y rendimientos de la plataforma para {report.monthName}.
          </p>
        </div>

        {/* Period Selector & CSV Export */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 p-1.5 rounded-2xl">
            <Calendar className="w-4 h-4 text-brand-400 ml-2" />
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none pr-2 cursor-pointer"
            >
              {periods.map((p) => (
                <option key={`${p.year}-${p.month}`} value={`${p.year}-${p.month}`} className="bg-gray-900 text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Ingresos Brutos Estimados</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">${report.grossEstimatedRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-gray-400">Total acumulado en {report.monthName}</p>
        </div>

        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Ganancia Administrador / Plataforma</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400">${report.totalPlatformShareAmount.toFixed(2)}</p>
          <p className="text-[11px] text-gray-400">Comisiones de la plataforma</p>
        </div>

        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Pago Total a Autores</span>
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white">${report.totalAuthorShareAmount.toFixed(2)}</p>
          <p className="text-[11px] text-gray-400">Reparto entre {report.authorsCount} usuarios</p>
        </div>

        <div className="p-5 bg-gray-900 rounded-2xl border border-gray-800 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
            <span>Lecturas Totales del Mes</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-300">{report.totalViews.toLocaleString()}</p>
          <p className="text-[11px] text-gray-400">Basado en RPM de ${report.rpmEstimate.toFixed(2)}</p>
        </div>
      </div>

      {/* Adjustable RPM Bar */}
      <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-2 text-gray-300">
          <Sliders className="w-4 h-4 text-brand-400 flex-shrink-0" />
          <span>
            <strong>Ajuste de Cierre AdSense (RPM):</strong> Ajusta la estimación de ganancias por cada 1,000 impresiones.
          </span>
        </div>

        <form onSubmit={handleRpmUpdate} className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-gray-400 font-bold">$</span>
          <input
            type="number"
            step="0.10"
            min="0.1"
            value={rpmInput}
            onChange={(e) => setRpmInput(e.target.value)}
            className="w-20 p-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-center font-bold text-xs"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-xs"
          >
            Actualizar RPM
          </button>
        </form>
      </div>

      {/* Detailed Per-User Breakdown Table */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif text-xl font-bold text-white">Desglose Detallado por Usuario / Autor</h2>
          </div>
          <span className="text-xs text-gray-400 font-semibold">{report.authors.length} Autores en Reporte</span>
        </div>

        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-gray-800/60 text-gray-400 font-bold uppercase tracking-wider text-[10px] border-b border-gray-800">
                <tr>
                  <th className="p-4">Autor / Usuario</th>
                  <th className="p-4 text-center">Historias Mes</th>
                  <th className="p-4 text-center">Vistas Mes</th>
                  <th className="p-4 text-center">% Reparto</th>
                  <th className="p-4 text-right">Bruto Generado</th>
                  <th className="p-4 text-right">Pago al Autor</th>
                  <th className="p-4 text-right">Ganancia Admin</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {report.authors.map((author) => (
                  <tr key={author.id} className="hover:bg-gray-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-brand-800 text-white flex items-center justify-center font-bold font-serif overflow-hidden flex-shrink-0">
                          {author.avatarUrl ? (
                            <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
                          ) : (
                            author.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center space-x-1.5">
                            <span>{author.name}</span>
                            {author.role === "ADMIN" && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 rounded font-bold">Admin</span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">@{author.username}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center font-semibold text-gray-200">
                      {author.articlesCount}
                    </td>

                    <td className="p-4 text-center font-bold text-amber-300">
                      {author.monthlyViews.toLocaleString()}
                    </td>

                    <td className="p-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-bold text-white">{author.authorSharePct}% Autor</span>
                        <span className="text-[10px] text-gray-400">{author.platformSharePct}% Admin</span>
                        {author.isCustomShare && (
                          <span className="text-[9px] bg-brand-950 text-brand-300 px-1 rounded border border-brand-800 mt-0.5">Personalizado</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right font-bold text-gray-300">
                      ${author.grossRevenue.toFixed(2)}
                    </td>

                    <td className="p-4 text-right font-black text-emerald-400 text-sm">
                      ${author.authorShareAmount.toFixed(2)}
                    </td>

                    <td className="p-4 text-right font-bold text-blue-400">
                      ${author.platformShareAmount.toFixed(2)}
                    </td>

                    <td className="p-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                        <span>{author.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
