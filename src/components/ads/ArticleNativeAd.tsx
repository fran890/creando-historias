"use client";

import { useEffect, useState } from "react";
import AdsterraNativeBanner from "./AdsterraNativeBanner";

interface ArticleNativeAdProps {
  placement: "header" | "sidebar";
}

/**
 * Responsive Article Native Ad:
 * - On mobile (< 1024px): renders right under the title & subtitle of the story.
 * - On desktop (>= 1024px): renders in the right sidebar.
 * Ensures only ONE container exists in the DOM so Adsterra invoke.js fills it with 100% reliability.
 */
export default function ArticleNativeAd({ placement }: ArticleNativeAdProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return null;

  // Mobile position: under title and subtitle
  if (isMobile && placement === "header") {
    return (
      <div className="w-full my-5">
        <div className="w-full bg-white/80 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-3 sm:p-4 shadow-xs">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-2 block text-center select-none">
            Publicidad recomendada
          </span>
          <AdsterraNativeBanner />
        </div>
      </div>
    );
  }

  // Desktop position: sticky right sidebar
  if (!isMobile && placement === "sidebar") {
    return (
      <div className="w-full sticky top-20">
        <div className="w-full min-h-[880px] bg-white/70 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-start text-center overflow-hidden shadow-xs">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-2.5 select-none">
            Publicidad recomendada
          </span>
          <div className="w-full flex-grow flex flex-col justify-start items-center">
            <AdsterraNativeBanner />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
