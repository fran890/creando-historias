"use client";

import AdsterraAd from "./AdsterraAd";
import { ADSTERRA_KEYS } from "@/lib/adsterra-config";

interface LeftSidebarAdProps {
  className?: string;
  mobile?: boolean;
}

export default function LeftSidebarAd({ className = "", mobile = false }: LeftSidebarAdProps) {
  const adCount = mobile ? 2 : 5;

  return (
    <div className={`w-full ${!mobile ? "lg:sticky lg:top-20" : ""} ${className}`}>
      <div className="w-full bg-white/70 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-start text-center overflow-hidden shadow-xs">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400/70 dark:text-gray-600/70 mb-2.5 select-none">
          Publicidad
        </span>

        <div className="w-full flex flex-col items-center gap-4">
          {Array.from({ length: adCount }).map((_, index) => (
            <div
              key={`left-sidebar-ad-${index}`}
              className="w-full max-w-[320px] rounded-xl border border-gray-100/80 dark:border-gray-800/80 bg-gray-50/70 dark:bg-gray-950/30 p-2 overflow-hidden"
            >
              <div className="flex h-[50px] w-full items-center justify-center overflow-hidden">
                <AdsterraAd
                  adKey={ADSTERRA_KEYS.headerMobile320x50}
                  width={320}
                  height={50}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
