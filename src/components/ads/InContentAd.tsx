"use client";

import { useEffect, useState } from "react";
import AdsterraAd from "./AdsterraAd";
import { ADSTERRA_KEYS } from "@/lib/adsterra-config";

interface InContentAdProps {
  slotId?: string;
  format?: string;
  className?: string;
  index?: number;
}

/**
 * In-Content Ad placement for article body.
 * Renders TWO stacked Adsterra banner ads per slot for better mobile fill.
 * Mobile-first: uses 320x50 banners on mobile, 468x60 on desktop.
 */
export default function InContentAd({ slotId, format, className = "", index = 0 }: InContentAdProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile === null) return null;

  const adConfig = isMobile
    ? {
        key: ADSTERRA_KEYS.headerMobile320x50,
        width: 320,
        height: 50,
      }
    : {
        key: ADSTERRA_KEYS.headerDesktop728x90,
        width: 728,
        height: 90,
      };

  return (
    <div className={`w-full my-6 sm:my-8 flex justify-center ${className}`}>
      <div
        className="inline-flex max-w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-200/60 bg-gray-50/70 p-2 text-center dark:border-gray-800/60 dark:bg-gray-900/40"
        style={{ width: adConfig.width + 16 }}
      >
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1.5 select-none">
          Publicidad
        </span>
        {/* First ad */}
        <div
          className="flex max-w-full items-center justify-center overflow-hidden"
          style={{ width: adConfig.width, height: adConfig.height }}
        >
          <AdsterraAd
            adKey={adConfig.key}
            width={adConfig.width}
            height={adConfig.height}
          />
        </div>
        {/* Second ad stacked below */}
        <div
          className="flex max-w-full items-center justify-center overflow-hidden mt-1.5"
          style={{ width: adConfig.width, height: adConfig.height }}
        >
          <AdsterraAd
            adKey={adConfig.key}
            width={adConfig.width}
            height={adConfig.height}
          />
        </div>
      </div>
    </div>
  );
}
