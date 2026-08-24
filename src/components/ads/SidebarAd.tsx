"use client";

import { useEffect, useRef } from "react";
import { Info } from "lucide-react";

interface SidebarAdProps {
  slotId?: string;
}

export default function SidebarAd({ slotId }: SidebarAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);
  const isRealSlot = slotId && /^\d{10,}$/.test(slotId);

  useEffect(() => {
    if (adClientId && isRealSlot && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        try {
          if (adRef.current && !adRef.current.getAttribute("data-adsbygoogle-status")) {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          }
        } catch (err) {
          // Suppress AdSense TagError
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [adClientId, isRealSlot]);

  if (adClientId && isRealSlot) {
    return (
      <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClientId}
          data-ad-slot={slotId}
          data-ad-format="rectangle"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Visual Mock Placeholder matching user reference image (lateral column)
  return (
    <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        <span>Anuncio Lateral</span>
        <Info className="w-3 h-3" />
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Patrocinado</span>
        <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-snug">
          Oportunidades de Empleo Remoto
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Postula hoy mismo a vacantes internacionales con horario flexible.
        </p>
      </div>

      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-sm"
      >
        Aplicar Ahora
      </a>
    </div>
  );
}
