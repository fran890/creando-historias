"use client";

import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
}

function createAdsterraAdBlockHtml(blockNumber: number): string {
  return `<div class="article-adsterra-block my-8 p-3 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-gray-900/40 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 text-center overflow-hidden shadow-xs">
  <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 pointer-events-none">Publicidad</span>
  <div id="container-666fc12a09a07ad15eeca1a70b387d4b" class="w-full flex justify-center items-center overflow-hidden min-h-[60px]"></div>
</div>`;
}

function injectSmartAdBlocks(htmlContent: string): string {
  if (!htmlContent) return "";

  // Split HTML into blocks by paragraph (<p>) or subheading (<h2>)
  const parts = htmlContent.split(/(?=<p[\s>]|<h2[\s>])/gi);
  const totalParts = parts.length;

  if (totalParts <= 2) {
    return htmlContent;
  }

  // Calculate optimal ad block count based on content length
  let maxAds = 1;
  if (totalParts >= 15) maxAds = 3;
  else if (totalParts >= 8) maxAds = 2;

  const step = Math.max(1, Math.floor(totalParts / (maxAds + 1)));
  const targetIndices: number[] = [];

  for (let i = 1; i <= maxAds; i++) {
    const idx = Math.min(i * step, totalParts - 1);
    targetIndices.push(idx);
  }

  const uniqueIndices = Array.from(new Set(targetIndices)).sort((a, b) => a - b);

  let result = "";
  let blockCounter = 1;

  parts.forEach((part, index) => {
    result += part;
    if (uniqueIndices.includes(index) && blockCounter <= maxAds) {
      result += createAdsterraAdBlockHtml(blockCounter);
      blockCounter++;
    }
  });

  return result;
}

export default function ArticleReader({ content, className = "" }: ArticleReaderProps) {
  const optimizedContent = injectSmartAdBlocks(optimizeHtmlImages(content));

  return (
    <div
      className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
    />
  );
}
