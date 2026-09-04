"use client";

import { optimizeHtmlImages } from "@/lib/images";
import InContentAd from "@/components/ads/InContentAd";

interface ArticleReaderProps {
  content: string;
  className?: string;
  showInContentAd?: boolean;
}

function splitContentForInContentAd(html: string) {
  const paragraphEndMatches = Array.from(html.matchAll(/<\/p>/gi));
  if (paragraphEndMatches.length < 5) {
    return null;
  }

  const thirdParagraphEnd = paragraphEndMatches[2];
  const splitIndex = (thirdParagraphEnd.index ?? 0) + thirdParagraphEnd[0].length;

  return {
    beforeAd: html.slice(0, splitIndex),
    afterAd: html.slice(splitIndex),
  };
}

export default function ArticleReader({
  content,
  className = "",
  showInContentAd = false,
}: ArticleReaderProps) {
  const optimizedContent = optimizeHtmlImages(content);
  const contentParts = showInContentAd ? splitContentForInContentAd(optimizedContent) : null;

  if (contentParts) {
    return (
      <div
        className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
      >
        <div dangerouslySetInnerHTML={{ __html: contentParts.beforeAd }} />
        <InContentAd className="max-w-[750px]" />
        <div dangerouslySetInnerHTML={{ __html: contentParts.afterAd }} />
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
