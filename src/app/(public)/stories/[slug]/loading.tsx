import { Loader2 } from "lucide-react";

export default function ArticleStoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Navigation Breadcrumb Skeleton */}
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />

      {/* Main 2-Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Article Column Skeleton */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-gray-800 space-y-6">
            <div className="h-6 w-24 bg-brand-500/10 rounded-full" />
            <div className="h-10 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            <div className="h-6 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />

            {/* Author Row Skeleton */}
            <div className="flex items-center space-x-3 py-4 border-y border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              </div>
            </div>

            {/* Image Skeleton */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />

            {/* Paragraphs Skeleton */}
            <div className="space-y-4 pt-4">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-4 w-11/12 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Sidebar Column Skeleton */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
          </div>
        </aside>
      </div>
    </div>
  );
}
