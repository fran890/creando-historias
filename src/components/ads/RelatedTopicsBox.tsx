"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import AdIntentDrawer from "./AdIntentDrawer";

export default function RelatedTopicsBox() {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Hide the "Ver más" box in production when AdSense is active to allow real AdSense ads to occupy the space
  if (adClientId) {
    return null;
  }

  const topics = [
    "Educación y formación musical",
    "Historias y narrativa",
    "Psicología y comportamiento humano",
  ];

  return (
    <>
      <div className="my-8 bg-blue-50/50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xs font-sans">
        <div className="bg-blue-100/60 dark:bg-gray-800 px-5 py-2.5 font-serif font-bold text-gray-900 dark:text-white text-sm">
          Ver más (Modo Desarrollo)
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          {topics.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedTopic(t)}
              className="w-full px-5 py-3 flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 transition text-left"
            >
              <span>{t}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      <AdIntentDrawer
        isOpen={selectedTopic !== null}
        topic={selectedTopic || ""}
        onClose={() => setSelectedTopic(null)}
      />
    </>
  );
}
