"use client";

import { useEffect, useRef } from "react";
import { registerAdUnit } from "@/lib/adsense";
import { isManualAdSenseMode } from "@/lib/adsense-config";

interface NativeMatchedAdProps {
  slotId?: string;
}

export default function NativeMatchedAd({ slotId }: NativeMatchedAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);
  const isRealSlot = slotId && /^\d{10,}$/.test(slotId);
  const isManualMode = isManualAdSenseMode();

  useEffect(() => {
    if (isManualMode && adClientId && isRealSlot) {
      return registerAdUnit(adRef.current);
    }
  }, [adClientId, isManualMode, isRealSlot]);

  if (!isManualMode || !adClientId || !isRealSlot) return null;

  return (
    <div className="ad-container bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-center overflow-hidden flex items-center justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-format="autorelaxed"
        data-ad-client={adClientId}
        data-ad-slot={slotId}
      />
    </div>
  );
}
