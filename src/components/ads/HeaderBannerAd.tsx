"use client";

import AdsterraAd from "./AdsterraAd";

interface HeaderBannerAdProps {
  slotId?: string;
  className?: string;
}

/**
 * Responsive Header Banner Ad:
 * - Desktop & Tablet (>= 640px): 728x90 Leaderboard (key: 7dc4efd221856c7cc01bfcaa22b2c289)
 * - Mobile (< 640px): 320x50 Mobile Leaderboard (key: 38e93328cc31a4d67bb5967d1a57b595)
 */
export default function HeaderBannerAd({ slotId, className = "" }: HeaderBannerAdProps) {
  return (
    <div className={`w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 ${className}`}>
      <div className="w-full bg-white/70 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl py-2 px-3 flex flex-col items-center justify-center text-center overflow-hidden shadow-xs">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-1 select-none">
          Publicidad
        </span>

        {/* Desktop & Tablet: Official 728x90 Leaderboard */}
        <div
          className="hidden sm:flex justify-center items-center w-full min-h-[90px] overflow-hidden"
          style={{ touchAction: "pan-y" }}
        >
          <AdsterraAd
            adKey="7dc4efd221856c7cc01bfcaa22b2c289"
            width={728}
            height={90}
          />
        </div>

        {/* Mobile: Official 320x50 Mobile Leaderboard */}
        <div
          className="flex sm:hidden justify-center items-center w-full min-h-[50px] overflow-hidden"
          style={{ touchAction: "pan-y" }}
        >
          <AdsterraAd
            adKey="38e93328cc31a4d67bb5967d1a57b595"
            width={320}
            height={50}
          />
        </div>
      </div>
    </div>
  );
}
