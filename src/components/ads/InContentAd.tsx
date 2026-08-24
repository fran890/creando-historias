"use client";

import { useEffect, useRef } from "react";
import { Info, ExternalLink } from "lucide-react";

interface InContentAdProps {
  slotId?: string;
  format?: "auto" | "fluid" | "rectangle";
}

export default function InContentAd({ slotId = "1234567890", format = "auto" }: InContentAdProps) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adClientId && typeof window !== "undefined") {
      try {
        if (adRef.current && !adRef.current.getAttribute("data-adsbygoogle-status")) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error("AdSense in-content error:", err);
      }
    }
  }, [adClientId]);

  if (adClientId) {
    return (
      <div className="my-8 text-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Visual Mock Placement matching reference site (creando mil historias)
  return (
    <div className="my-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm overflow-hidden relative font-sans">
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 mb-3 uppercase tracking-wider">
        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-500">Anuncio de Google</span>
        <div className="flex items-center space-x-1 cursor-pointer">
          <Info className="w-3.5 h-3.5 text-brand-500" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-500 via-purple-600 to-indigo-600 text-white flex flex-col items-center justify-center text-center p-2 shadow-md flex-shrink-0">
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
          className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md transition flex-shrink-0"
        >
          <span>Abrir</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
