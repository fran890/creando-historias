"use client";

import { useEffect, useRef } from "react";
import { Info } from "lucide-react";

interface SidebarAdProps {
  slotId?: string;
}

export default function SidebarAd({ slotId }: SidebarAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";
  const effectiveSlotId = slotId || process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT_ID;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const adElement = adRef.current;

    if (!adElement || !adClientId) {
      return;
    }

    // Evitar procesar dos veces el mismo elemento ins
    if (
      adElement.getAttribute("data-adsbygoogle-status") ||
      adElement.getAttribute("data-ad-status")
    ) {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("[AdSense] Error al inicializar unidad lateral:", error);
    }
  }, [adClientId, effectiveSlotId]);

  if (process.env.NODE_ENV === "production" || adClientId) {
    return (
      <div className="sticky top-24 w-full my-[50px] text-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClientId}
          {...(effectiveSlotId ? { "data-ad-slot": effectiveSlotId } : {})}
          data-ad-format="rectangle"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Visual Mock Placeholder en Desarrollo
  return (
    <div className="sticky top-24 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        <span>Anuncio Lateral (Modo Desarrollo)</span>
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
        className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition shadow-xs"
      >
        Aplicar Ahora
      </a>
    </div>
  );
}
