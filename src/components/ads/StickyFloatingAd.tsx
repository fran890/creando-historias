"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function StickyFloatingAd() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 shadow-2xl p-2 flex justify-center items-center">
      <button
        onClick={() => setClosed(true)}
        className="absolute top-1 right-2 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full bg-gray-100 dark:bg-gray-800 transition"
        title="Cerrar Anuncio"
      >
        <X className="w-4 h-4" />
      </button>
      <div id="container-666fc12a09a07ad15eeca1a70b387d4b" className="w-full max-w-4xl flex justify-center items-center overflow-hidden min-h-[50px]" />
    </div>
  );
}
