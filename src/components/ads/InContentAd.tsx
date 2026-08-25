"use client";

import { useEffect, useRef } from "react";
import { Info, ExternalLink } from "lucide-react";

interface InContentAdProps {
  slotId?: string;
  format?: "auto" | "fluid" | "rectangle";
}

export default function InContentAd({ slotId, format = "auto" }: InContentAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";
  const effectiveSlotId = slotId || process.env.NEXT_PUBLIC_ADSENSE_INCONTENT_SLOT_ID;
  const isValidSlot = effectiveSlotId && /^\d{10,}$/.test(effectiveSlotId);
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const adElement = adRef.current;

    if (!adElement || !adClientId || !isValidSlot) {
      return;
    }

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
      console.error("[AdSense] Error al inicializar unidad en contenido:", error);
    }
  }, [adClientId, effectiveSlotId, isValidSlot]);

  // If explicit Slot ID is provided, render manual AdSense unit with data-ad-slot
  if (adClientId && isValidSlot) {
    return (
      <div className="w-full my-[50px] text-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClientId}
          data-ad-slot={effectiveSlotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // In Auto-Ads mode (no slot ID): return null to allow Google Auto-Ads to scan content & place ads naturally
  if (process.env.NODE_ENV === "production" || adClientId) {
    return null;
  }

  // Visual Mock Placeholder en Desarrollo
  return (
    <div className="my-[50px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-xs overflow-hidden relative font-sans">
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">
        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">Anuncio de Google (Modo Desarrollo)</span>
        <div className="flex items-center space-x-1 cursor-pointer">
          <Info className="w-3.5 h-3.5 text-brand-500" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-500 via-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center text-center p-2 shadow-xs flex-shrink-0">
            <span className="text-[10px] font-bold uppercase">Oportunidad</span>
            <span className="text-xs font-extrabold">$36 / hr</span>
          </div>
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-gray-900 dark:text-white text-base sm:text-lg leading-snug">
              Transcriptor de texto y empleos desde casa
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              Trabajo secundario ideal con horario flexible y pagos semanales directos.
            </p>
          </div>
        </div>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition flex-shrink-0"
        >
          <span>Abrir</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
