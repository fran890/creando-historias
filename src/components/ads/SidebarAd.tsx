"use client";

import AdsterraNativeBanner from "./AdsterraNativeBanner";

interface SidebarAdProps {
  slotId?: string;
  className?: string;
}

export default function SidebarAd({ slotId, className = "" }: SidebarAdProps) {
  return (
    <div className={`w-full sticky top-20 ${className}`}>
      <div className="w-full min-h-[650px] bg-white/60 dark:bg-gray-900/40 border border-gray-200/40 dark:border-gray-800/40 rounded-2xl p-4 flex flex-col items-center justify-start text-center overflow-hidden shadow-xs">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-3 select-none">
          Publicidad
        </span>
        <div className="w-full flex-grow flex justify-center items-center">
          <AdsterraNativeBanner />
        </div>
      </div>
    </div>
  );
}
