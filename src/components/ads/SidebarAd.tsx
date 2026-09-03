"use client";

import AdsterraNativeBanner from "./AdsterraNativeBanner";

interface SidebarAdProps {
  slotId?: string;
  className?: string;
}

export default function SidebarAd({ slotId, className = "" }: SidebarAdProps) {
  return (
    <div className={`w-full lg:sticky lg:top-20 ${className}`}>
      <div className="w-full min-h-[380px] lg:min-h-[880px] bg-white/70 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-start text-center overflow-hidden shadow-xs">
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
