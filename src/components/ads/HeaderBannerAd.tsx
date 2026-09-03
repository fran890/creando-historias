"use client";

import AdsterraAd from "./AdsterraAd";

interface HeaderBannerAdProps {
  slotId?: string;
  className?: string;
}

export default function HeaderBannerAd({ slotId, className = "" }: HeaderBannerAdProps) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-4 py-2 ${className}`}>
      <div className="w-full bg-white/60 dark:bg-gray-900/40 border border-gray-200/40 dark:border-gray-800/40 rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center overflow-hidden">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-0.5 select-none">
          Publicidad
        </span>
        <div className="w-full flex justify-center items-center overflow-hidden" style={{ maxWidth: "100%" }}>
          <AdsterraAd width={468} height={60} />
        </div>
      </div>
    </div>
  );
}
