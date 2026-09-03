"use client";

import AdsterraNativeBanner from "./AdsterraNativeBanner";

interface SidebarAdProps {
  slotId?: string;
  className?: string;
}

export default function SidebarAd({ slotId, className = "" }: SidebarAdProps) {
  return (
    <div className={`w-full sticky top-20 ${className}`}>
      <div className="w-full bg-white/60 dark:bg-gray-900/40 border border-gray-200/40 dark:border-gray-800/40 rounded-2xl p-2 flex flex-col items-center justify-center text-center overflow-hidden">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-0.5 select-none">
          Publicidad
        </span>
        <AdsterraNativeBanner />
      </div>
    </div>
  );
}
