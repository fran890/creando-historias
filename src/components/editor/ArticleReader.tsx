"use client";

import { useEffect, useRef } from "react";
import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
}

const AD_KEY = "6dbb818f76a41d9fd7b276a64638934f";

function createAdsterraAdBlockHtml(): string {
  return `<div class="article-adsterra-block my-8 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-3 text-center overflow-hidden" data-adsterra-inject="true">
  <span class="text-[9px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1 select-none">Publicidad</span>
  <div class="adsterra-slot w-full flex justify-center items-center overflow-hidden" style="min-height:60px"></div>
</div>`;
}

function injectSmartAdBlocks(htmlContent: string): string {
  if (!htmlContent) return "";

  const parts = htmlContent.split(/(?=<p[\s>]|<h2[\s>])/gi);
  const totalParts = parts.length;

  if (totalParts <= 3) {
    return htmlContent;
  }

  // Calculate optimal ad block count based on content length
  let maxAds = 1;
  if (totalParts >= 15) maxAds = 3;
  else if (totalParts >= 8) maxAds = 2;

  const step = Math.max(2, Math.floor(totalParts / (maxAds + 1)));
  const targetIndices: number[] = [];

  for (let i = 1; i <= maxAds; i++) {
    const idx = Math.min(i * step, totalParts - 1);
    targetIndices.push(idx);
  }

  const uniqueIndices = Array.from(new Set(targetIndices)).sort((a, b) => a - b);

  let result = "";
  let blockCounter = 0;

  parts.forEach((part, index) => {
    result += part;
    if (uniqueIndices.includes(index) && blockCounter < maxAds) {
      result += createAdsterraAdBlockHtml();
      blockCounter++;
    }
  });

  return result;
}

export default function ArticleReader({ content, className = "" }: ArticleReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optimizedContent = injectSmartAdBlocks(optimizeHtmlImages(content));

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    // Find all injected ad slots and load Adsterra scripts into them
    const adSlots = container.querySelectorAll<HTMLElement>(".adsterra-slot");

    adSlots.forEach((slot) => {
      if (slot.childElementCount > 0) return; // Already loaded

      // Inject atOptions
      const optionsScript = document.createElement("script");
      optionsScript.textContent = `
        atOptions = {
          'key' : '${AD_KEY}',
          'format' : 'iframe',
          'height' : 60,
          'width' : 468,
          'params' : {}
        };
      `;
      slot.appendChild(optionsScript);

      // Inject invoke.js
      const invokeScript = document.createElement("script");
      invokeScript.src = `https://wailsilence.com/${AD_KEY}/invoke.js`;
      invokeScript.async = false;
      slot.appendChild(invokeScript);
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
    />
  );
}
