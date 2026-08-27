"use client";

import { useEffect, useRef } from "react";
import { registerAdUnit } from "@/lib/adsense";
import { isManualAdSenseMode } from "@/lib/adsense-config";

interface SidebarAdProps {
  slotId?: string;
}

export default function SidebarAd({ slotId }: SidebarAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";
  const effectiveSlotId = slotId || process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT_ID;
  const adRef = useRef<HTMLModElement>(null);
  const isManualMode = isManualAdSenseMode();

  useEffect(() => {
    if (!isManualMode) return;
    return registerAdUnit(adRef.current);
  }, [isManualMode]);

  if (!isManualMode) return null;

  return (
    <div className="ad-container sticky top-24 w-full my-4 text-center overflow-hidden flex items-center justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={adClientId}
        {...(effectiveSlotId ? { "data-ad-slot": effectiveSlotId } : {})}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
    </div>
  );
}
