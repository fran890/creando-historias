"use client";

import AdsterraAd from "./AdsterraAd";

interface HeaderBannerAdProps {
  slotId?: string;
  className?: string;
}

export default function HeaderBannerAd({ slotId, className = "" }: HeaderBannerAdProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-2 ${className}`}>
      <div className="w-full bg-white/80 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-xs">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1 select-none">
          Publicidad
        </span>
        <AdsterraAd width={468} height={60} />
      </div>
    </div>
  );
}
