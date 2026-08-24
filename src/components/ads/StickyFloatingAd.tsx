"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, ChevronUp, Info, ExternalLink } from "lucide-react";

interface StickyFloatingAdProps {
  slotId?: string;
}

export default function StickyFloatingAd({ slotId = "555666777" }: StickyFloatingAdProps) {
  const [closed, setClosed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (adClientId && typeof window !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense floating error:", err);
      }
    }
  }, [adClientId]);

  if (closed) return null;

  if (adClientId) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-800 shadow-2xl p-2 flex justify-center items-center">
        <button
          onClick={() => setClosed(true)}
          className="absolute top-1 right-2 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-100 dark:bg-gray-800"
          title="Cerrar Anuncio"
        >
          <X className="w-4 h-4" />
        </button>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", maxHeight: "90px" }}
          data-ad-client={adClientId}
          data-ad-slot={slotId}
          data-ad-format="horizontal"
        />
      </div>
    );
  }

  // Visual Floating Mock Placement matching user reference image
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 max-w-4xl mx-auto px-4 pb-2">
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Top Control Bar */}
        <div className="bg-gray-50 dark:bg-gray-800/80 px-4 py-1.5 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 text-[10px] text-gray-400 font-semibold">
          <div className="flex items-center space-x-1">
            <Info className="w-3 h-3 text-blue-500" />
            <span>Anuncio Flotante de Google</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-0.5 hover:text-gray-900 dark:hover:text-white transition"
              title={collapsed ? "Expandir" : "Plegar"}
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setClosed(true)}
              className="p-0.5 hover:text-red-500 transition"
              title="Cerrar Anuncio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ad Body Content */}
        {!collapsed && (
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-pink-600 text-white font-bold flex items-center justify-center text-xs text-center flex-shrink-0">
                PROMO
              </div>
              <div>
                <h5 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base hover:underline cursor-pointer">
                  Trabajar desde casa en línea
                </h5>
                <p className="text-xs text-gray-500">
                  Survey Panels &ndash; Trabajar desde casa de forma remota y flexible.
                </p>
              </div>
            </div>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center space-x-1 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs rounded-full shadow-md transition flex-shrink-0"
            >
              <span>Visitar el sitio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
