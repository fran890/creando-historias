"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { registerAdUnit } from "@/lib/adsense";
import { isManualAdSenseMode } from "@/lib/adsense-config";

interface StickyFloatingAdProps {
  slotId?: string;
}

export default function StickyFloatingAd({ slotId }: StickyFloatingAdProps) {
  const [closed, setClosed] = useState(false);
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);
  const isRealSlot = slotId && /^\d{10,}$/.test(slotId);
  const isManualMode = isManualAdSenseMode();

  useEffect(() => {
    if (isManualMode && adClientId && isRealSlot) {
      return registerAdUnit(adRef.current);
    }
  }, [adClientId, isManualMode, isRealSlot]);

  if (!isManualMode || closed || !adClientId || !isRealSlot) return null;

  return (
    <div className="ad-container fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-800 shadow-2xl p-2 flex justify-center items-center">
      <button
        onClick={() => setClosed(true)}
        className="absolute top-1 right-2 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-100 dark:bg-gray-800"
        title="Cerrar Anuncio"
      >
        <X className="w-4 h-4" />
      </button>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={adClientId}
        data-ad-slot={slotId}
        data-ad-format="horizontal"
      />
    </div>
  );
}
