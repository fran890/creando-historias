"use client";

import AdsterraAd from "./AdsterraAd";

interface SidebarAdProps {
  slotId?: string;
  className?: string;
}

export default function SidebarAd({ slotId, className = "" }: SidebarAdProps) {
  return (
    <div className={`w-full sticky top-20 ${className}`}>
      <div className="w-full bg-white/80 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-xs">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1 select-none">
          Publicidad
        </span>
        <AdsterraAd width={300} height={250} />
      </div>
    </div>
  );
}
