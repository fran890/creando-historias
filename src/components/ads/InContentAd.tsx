"use client";

import AdsterraAd from "./AdsterraAd";

interface InContentAdProps {
  slotId?: string;
  format?: string;
  className?: string;
  index?: number;
}

/**
 * In-Content Ad placement for article body.
 * Renders TWO stacked Adsterra banner ads per slot for better mobile fill,
 * wrapped in a subtle container with "Publicidad" label.
 * Mobile-first: uses 320x50 banners on mobile, 468x60 on desktop.
 */
export default function InContentAd({ slotId, format, className = "", index = 0 }: InContentAdProps) {
  return (
    <div className={`w-full my-6 sm:my-8 ${className}`}>
      <div className="w-full bg-gray-50/80 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1.5 select-none">
          Publicidad
        </span>
        {/* First ad */}
        <div className="w-full flex justify-center items-center overflow-hidden">
          <AdsterraAd width={468} height={60} />
        </div>
        {/* Second ad stacked below */}
        <div className="w-full flex justify-center items-center overflow-hidden mt-1.5">
          <AdsterraAd width={468} height={60} />
        </div>
      </div>
    </div>
  );
}
