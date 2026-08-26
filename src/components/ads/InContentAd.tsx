"use client";

import { useEffect, useRef } from "react";
import { registerAdUnit } from "@/lib/adsense";

interface InContentAdProps {
  slotId?: string;
  format?: "auto" | "fluid" | "rectangle";
}

export default function InContentAd({ slotId, format = "auto" }: InContentAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";
  const effectiveSlotId = slotId || process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT_ID;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    return registerAdUnit(adRef.current);
  }, []);

  return (
    <div className="ad-container w-full my-6 text-center overflow-hidden flex items-center justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={adClientId}
        {...(effectiveSlotId ? { "data-ad-slot": effectiveSlotId } : {})}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
