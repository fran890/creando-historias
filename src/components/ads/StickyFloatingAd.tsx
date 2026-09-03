"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdsterraAd from "./AdsterraAd";

interface StickyFloatingAdProps {
  slotId?: string;
  className?: string;
}

/**
 * Mobile & Desktop Bottom Sticky Floating Ad Banner:
 * Uses official 320x50 Mobile Leaderboard key (38e93328cc31a4d67bb5967d1a57b595).
 */
export default function StickyFloatingAd({ slotId, className = "" }: StickyFloatingAdProps) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-2xl py-1 px-2 flex justify-center items-center ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      <button
        onClick={() => setClosed(true)}
        className="absolute top-1 right-2 z-10 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-100 dark:bg-gray-800 transition shadow-sm"
        title="Cerrar Anuncio"
        aria-label="Cerrar anuncio"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div
        className="w-full max-w-[320px] flex justify-center items-center overflow-hidden"
        style={{ minHeight: "50px", touchAction: "pan-y" }}
      >
        <AdsterraAd
          adKey="38e93328cc31a4d67bb5967d1a57b595"
          width={320}
          height={50}
        />
      </div>
    </div>
  );
}
