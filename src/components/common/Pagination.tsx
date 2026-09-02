import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  pageParam?: string;
  showSinglePage?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = "",
  pageParam = "page",
  showSinglePage = true,
}: PaginationProps) {
  if (totalPages <= 0) return null;
  if (!showSinglePage && totalPages <= 1) return null;

  const buildUrl = (page: number) => {
    // Check if baseUrl already contains query parameters
    const separator = baseUrl.includes("?") ? "&" : "?";
    // Clean trailing slash if baseUrl is just slash
    const base = baseUrl === "/" ? "" : baseUrl;
    return `${base}${separator}${pageParam}=${page}`;
  };

  // Helper to generate the list of page items (numbers and ellipses)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Navegación de páginas" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
      {/* Previous Button */}
      <div className="flex items-center space-x-1">
        {hasPrevious ? (
          <Link
            href={buildUrl(currentPage - 1)}
            aria-label="Página anterior"
            className="inline-flex items-center space-x-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </Link>
        ) : (
          <span className="inline-flex items-center space-x-1 px-4 py-2 opacity-40 text-xs font-semibold text-gray-400 border border-transparent cursor-not-allowed">
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </span>
        )}
      </div>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1.5 flex-wrap justify-center">
        {pages.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-xs text-gray-400 font-bold select-none">
                &hellip;
              </span>
            );
          }

          const pageNum = item as number;
          const isActive = pageNum === currentPage;

          return isActive ? (
            <span
              key={pageNum}
              aria-current="page"
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs"
            >
              {pageNum}
            </span>
          ) : (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              aria-label={`Ir a la página ${pageNum}`}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-xs font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition shadow-xs"
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="flex items-center space-x-1">
        {hasNext ? (
          <Link
            href={buildUrl(currentPage + 1)}
            aria-label="Página siguiente"
            className="inline-flex items-center space-x-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition shadow-xs"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center space-x-1 px-4 py-2 opacity-40 text-xs font-semibold text-gray-400 border border-transparent cursor-not-allowed">
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
