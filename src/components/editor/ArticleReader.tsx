"use client";

import { useEffect, useRef } from "react";
import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
}

const AD_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";
const IS_ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADSENSE !== "false";

function createAdBlockHtml(blockNumber: number): string {
  if (!IS_ADSENSE_ENABLED) return "";

  const slotEnvMap: Record<number, string | undefined> = {
    1: process.env.NEXT_PUBLIC_ADSENSE_SLOT_1,
    2: process.env.NEXT_PUBLIC_ADSENSE_SLOT_2,
    3: process.env.NEXT_PUBLIC_ADSENSE_SLOT_3,
    4: process.env.NEXT_PUBLIC_ADSENSE_SLOT_4,
    5: process.env.NEXT_PUBLIC_ADSENSE_SLOT_5,
    6: process.env.NEXT_PUBLIC_ADSENSE_SLOT_6,
  };
  const customSlotId = slotEnvMap[blockNumber];
  const slotAttribute = customSlotId ? `data-ad-slot="${customSlotId}"` : "";

  return `<div class="article-ad-box ad-slot-${blockNumber}" data-ad-block="${blockNumber}">
  <span class="ad-label">Publicidad</span>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${AD_CLIENT_ID}"
       ${slotAttribute}
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>`;
}

function injectSmartAdBlocks(htmlContent: string): string {
  if (!htmlContent) return "";
  if (!IS_ADSENSE_ENABLED) return htmlContent;

  // Split HTML into blocks by paragraph (<p>) or subheading (<h2>)
  const parts = htmlContent.split(/(?=<p[\s>]|<h2[\s>])/gi);
  const totalParts = parts.length;

  if (totalParts <= 1) {
    return htmlContent + createAdBlockHtml(1);
  }

  // Calculate optimal ad block count based on content length (prevents ad overload & unfilled slots)
  let maxAds = 1;
  if (totalParts >= 15) maxAds = 5;
  else if (totalParts >= 10) maxAds = 4;
  else if (totalParts >= 6) maxAds = 3;
  else if (totalParts >= 3) maxAds = 2;

  const step = Math.max(1, Math.floor(totalParts / maxAds));
  const targetIndices: number[] = [];

  for (let i = 0; i < maxAds; i++) {
    const idx = Math.min(1 + i * step, totalParts - 1);
    targetIndices.push(idx);
  }

  const uniqueIndices = Array.from(new Set(targetIndices)).sort((a, b) => a - b);

  let result = "";
  let blockCounter = 1;

  parts.forEach((part, index) => {
    result += part;
    if (uniqueIndices.includes(index) && blockCounter <= maxAds) {
      result += createAdBlockHtml(blockCounter);
      blockCounter++;
    }
  });

  return result;
}

export default function ArticleReader({ content, className = "" }: ArticleReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optimizedContent = injectSmartAdBlocks(optimizeHtmlImages(content));

  useEffect(() => {
    if (!IS_ADSENSE_ENABLED || typeof window === "undefined") return;
    if (!containerRef.current) return;

    const insElements = containerRef.current.querySelectorAll<HTMLModElement>("ins.adsbygoogle");

    // Push ads to Google AdSense
    insElements.forEach((ins) => {
      if (!ins.getAttribute("data-adsbygoogle-status") && !ins.getAttribute("data-ad-status")) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch {}
      }
    });

    // Observer to smoothly handle unfilled ad slot collapses without layout shift
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "data-ad-status") {
          const target = mutation.target as HTMLElement;
          const status = target.getAttribute("data-ad-status");
          const parentBox = target.closest(".article-ad-box") as HTMLElement;

          if (parentBox) {
            if (status === "unfilled") {
              parentBox.classList.add("ad-unfilled-collapsed");
            } else if (status === "filled") {
              parentBox.classList.add("ad-filled-visible");
            }
          }
        }
      });
    });

    insElements.forEach((ins) => {
      observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    });

    return () => observer.disconnect();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
    />
  );
}
