"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdsterraAd from "./AdsterraAd";

interface StickyFloatingAdProps {
  slotId?: string;
  className?: string;
}

export default function StickyFloatingAd({ slotId, className = "" }: StickyFloatingAdProps) {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800/80 shadow-2xl py-1 px-2 flex justify-center items-center ${className}`}>
      <button
        onClick={() => setClosed(true)}
        className="absolute top-1 right-2 z-10 p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-100/90 dark:bg-gray-800/90 transition-colors shadow-sm"
        title="Cerrar Anuncio"
        aria-label="Cerrar anuncio"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="w-full max-w-lg flex justify-center items-center overflow-hidden">
        <AdsterraAd width={468} height={60} />
      </div>
    </div>
  );
}
