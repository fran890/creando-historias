"use client";

import { optimizeHtmlImages } from "@/lib/images";
import InContentAd from "@/components/ads/InContentAd";

interface ArticleReaderProps {
  content: string;
  className?: string;
  /** Whether to inject in-content ads between paragraphs. Defaults to false. */
  showInContentAd?: boolean;
  /** Maximum number of in-content ad placements. Defaults to 6. */
  maxInContentAds?: number;
}

function splitContentForInContentAds(html: string, maxAds: number) {
  const paragraphEndMatches = Array.from(html.matchAll(/<\/p>/gi));
  if (paragraphEndMatches.length < 5) {
    return null;
  }

  const adParagraphIndexes: number[] = [];
  const firstAdAfterParagraph = 3;
  const paragraphsBetweenAds = 4;
  const minimumParagraphsAfterAd = 2;

  for (
    let paragraphNumber = firstAdAfterParagraph;
    paragraphNumber <= paragraphEndMatches.length - minimumParagraphsAfterAd;
    paragraphNumber += paragraphsBetweenAds
  ) {
    adParagraphIndexes.push(paragraphNumber - 1);
    if (adParagraphIndexes.length >= maxAds) break;
  }

  if (adParagraphIndexes.length === 0) return null;

  const chunks: string[] = [];
  let previousSplitIndex = 0;

  adParagraphIndexes.forEach((paragraphIndex) => {
    const match = paragraphEndMatches[paragraphIndex];
    const splitIndex = (match.index ?? 0) + match[0].length;
    chunks.push(html.slice(previousSplitIndex, splitIndex));
    previousSplitIndex = splitIndex;
  });

  chunks.push(html.slice(previousSplitIndex));

  return chunks;
}

export default function ArticleReader({
  content,
  className = "",
  showInContentAd = false,
  maxInContentAds = 6,
}: ArticleReaderProps) {
  const optimizedContent = optimizeHtmlImages(content);
  const contentParts = showInContentAd ? splitContentForInContentAds(optimizedContent, maxInContentAds) : null;

  if (contentParts) {
    return (
      <div
        className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
      >
        {contentParts.map((html, index) => (
          <div key={`article-content-chunk-${index}`}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {index < contentParts.length - 1 && <InContentAd index={index} className="max-w-[750px]" />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
    />
  );
}
