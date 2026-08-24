"use client";

import { useEffect, useRef } from "react";
import { Info, ExternalLink } from "lucide-react";

export default function NativeMatchedAd() {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adClientId && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        try {
          if (adRef.current && !adRef.current.getAttribute("data-adsbygoogle-status")) {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          }
        } catch (err) {
          // Suppress AdSense TagError gracefully
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [adClientId]);

  if (adClientId) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="autorelaxed"
          data-ad-client={adClientId}
          data-ad-slot="9988776655"
        />
      </div>
    );
  }

  // Native Matched Ad Card styled identically to recommended story cards
  return (
    <article className="p-6 bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-brand-200 dark:border-gray-800 space-y-3 relative overflow-hidden font-sans">
      <div className="flex items-center justify-between text-[10px] font-bold text-brand-500 uppercase tracking-wider">
        <span className="bg-brand-50 px-2 py-0.5 rounded border border-brand-200">Patrocinado</span>
        <div className="flex items-center space-x-1 text-gray-400">
          <Info className="w-3 h-3" />
          <span>Google Ads</span>
        </div>
      </div>
      <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white leading-snug">
        Gana dinero respondiendo encuestas pagadas desde tu celular
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2">
        Plataformas verificadas con pagos inmediatos. Comienza hoy gratis.
      </p>
      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">Anuncio Nativo</span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center space-x-1 text-xs font-bold text-brand-500 hover:underline"
        >
          <span>Visitar sitio</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
}
