"use client";

interface InContentAdProps {
  slotId?: string;
  format?: string;
  className?: string;
}

export default function InContentAd({ slotId, format, className = "" }: InContentAdProps) {
  return (
    <div className={`w-full my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <div className="w-full bg-gray-100/70 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-3 flex flex-col items-center justify-center text-center overflow-hidden min-h-[90px] shadow-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 pointer-events-none">
          Publicidad
        </span>
        <div id="container-666fc12a09a07ad15eeca1a70b387d4b" className="w-full flex justify-center items-center overflow-hidden min-h-[60px]" />
      </div>
    </div>
  );
}
