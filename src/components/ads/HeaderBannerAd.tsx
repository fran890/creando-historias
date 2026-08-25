"use client";

import { useEffect, useRef } from "react";
import { Info, ExternalLink } from "lucide-react";

interface HeaderBannerAdProps {
  slotId?: string;
}

export default function HeaderBannerAd({ slotId }: HeaderBannerAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const effectiveSlotId = slotId || process.env.NEXT_PUBLIC_ADSENSE_HEADER_SLOT_ID;
  const isValidSlot = effectiveSlotId && /^\d{10,}$/.test(effectiveSlotId);
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adClientId && isValidSlot && typeof window !== "undefined") {
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
  }, [adClientId, isValidSlot]);

  // Production Mode with explicit Slot ID (Strict 50px minimum margin)
  if (adClientId && isValidSlot) {
    return (
      <div className="w-full my-[50px] text-center overflow-hidden min-h-[90px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block", minWidth: "250px", minHeight: "90px" }}
          data-ad-client={adClientId}
          data-ad-slot={effectiveSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Production Mode without explicit Slot ID: Don't leave a blank box, allow Auto-Ads to inject cleanly
  if (adClientId) {
    return null;
  }

  // Development Fallback: Visual Mock rendered with strict 50px margin
  return (
    <div className="w-full my-[50px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xs overflow-hidden relative">
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-wider">
        <span>Anuncio Encabezado (Modo Desarrollo)</span>
        <div className="flex items-center space-x-1">
          <Info className="w-3 h-3 text-brand-500" />
          <span>Google Ads</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white flex items-center justify-center text-[10px] font-bold text-center p-1 shadow-xs">
            SUPER PROMO
          </div>
          <div>
            <h4 className="font-serif font-bold text-gray-900 dark:text-white text-base sm:text-lg">
              TRANSCRIPTOR DE TEXTO Y CONTENIDO &ndash; $36 / hora
            </h4>
            <p className="text-xs text-gray-500">
              Empleos desde casa con pago semanal. Elige tu propio horario. 100% remoto.
            </p>
          </div>
        </div>

        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center space-x-1.5 px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition shadow-xs flex-shrink-0"
        >
          <span>Abrir</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
