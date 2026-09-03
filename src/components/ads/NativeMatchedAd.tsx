"use client";

import AdsterraAd from "./AdsterraAd";

interface NativeMatchedAdProps {
  slotId?: string;
  className?: string;
}

export default function NativeMatchedAd({ slotId, className = "" }: NativeMatchedAdProps) {
  return (
    <div className={`w-full my-6 ${className}`}>
      <div className="w-full bg-gray-50/80 dark:bg-gray-900/40 border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center text-center overflow-hidden">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1 select-none">
          Contenido patrocinado
        </span>
        <AdsterraAd width={468} height={60} />
      </div>
    </div>
  );
}
