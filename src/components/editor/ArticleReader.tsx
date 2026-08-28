"use client";

import { useEffect, useRef } from "react";
import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
}

const AD_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";

function createAdBlockHtml(blockNumber: number): string {
  const slots: Record<number, string> = {
    1: "2852108163",
    2: "6599781488",
    3: "2927561565",
    4: "6364097902",
    5: "3737934564",
    6: "8651229759",
  };
  const slotId = slots[blockNumber] || "2852108163";

  return `<div class="code-block code-block-${blockNumber}" style="margin: 28px auto; text-align: center; display: block; clear: both;">
<!-- grasa equipo ${blockNumber} -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${AD_CLIENT_ID}"
     data-ad-slot="${slotId}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
</div>`;
}

function inject6AdBlocks(htmlContent: string): string {
  if (!htmlContent) return "";

  // Split HTML into blocks by paragraph (<p>) or subheading (<h2>)
  const parts = htmlContent.split(/(?=<p[\s>]|<h2[\s>])/gi);
  if (parts.length <= 1) {
    return htmlContent + createAdBlockHtml(1);
  }

  const totalParts = parts.length;
  // Distribute 6 ad blocks evenly across the total number of paragraphs/headings
  const step = Math.max(1, Math.floor(totalParts / 6));
  const targetIndices = [
    Math.min(1, totalParts - 1),
    Math.min(1 + step, totalParts - 1),
    Math.min(1 + step * 2, totalParts - 1),
    Math.min(1 + step * 3, totalParts - 1),
    Math.min(1 + step * 4, totalParts - 1),
    Math.min(1 + step * 5, totalParts - 1),
  ];

  const uniqueIndices = Array.from(new Set(targetIndices)).sort((a, b) => a - b);

  let result = "";
  let blockCounter = 1;

  parts.forEach((part, index) => {
    result += part;
    if (uniqueIndices.includes(index) && blockCounter <= 6) {
      result += createAdBlockHtml(blockCounter);
      blockCounter++;
    }
  });

  return result;
}

export default function ArticleReader({ content, className = "" }: ArticleReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const optimizedContent = inject6AdBlocks(optimizeHtmlImages(content));

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    const insElements = containerRef.current.querySelectorAll("ins.adsbygoogle");
    insElements.forEach((ins) => {
      if (!ins.getAttribute("data-adsbygoogle-status") && !ins.getAttribute("data-ad-status")) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch {}
      }
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
