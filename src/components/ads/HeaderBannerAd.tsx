"use client";

import AdsterraAd from "./AdsterraAd";

interface HeaderBannerAdProps {
  slotId?: string;
  className?: string;
}

export default function HeaderBannerAd({ slotId, className = "" }: HeaderBannerAdProps) {
  return (
    <div className={`w-full max-w-4xl mx-auto px-2 sm:px-4 py-2 ${className}`}>
      <div className="w-full bg-white/70 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl py-2.5 px-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-xs">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-1 select-none">
          Publicidad
        </span>
        <div className="adsterra-header-wrapper">
          <AdsterraAd width={468} height={60} />
        </div>
      </div>
    </div>
  );
}
