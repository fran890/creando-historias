"use client";

import React from "react";
import InContentAd from "@/components/ads/InContentAd";

interface ArticleReaderProps {
  content: string;
  className?: string;
  enableInArticleAds?: boolean;
}

const MAX_ADS_PER_PAGE = 16;

/**
 * Client component that renders article HTML content with:
 * - Clean paragraph structure (<p> elements) for AdSense Auto-Ads.
 * - In-content ads interspersed between paragraphs.
 * - Drop-cap styling for the first paragraph to enhance editorial aesthetics.
 */
export default function ArticleReader({ content, className = "", enableInArticleAds = true }: ArticleReaderProps) {
  if (enableInArticleAds && content.includes("</p>")) {
    const rawParagraphs = content.split("</p>");
    const paragraphs = rawParagraphs.filter((p) => p.trim().length > 0);
    const elements: React.ReactNode[] = [];
    let insertedAdsCount = 0;

    paragraphs.forEach((p, index) => {
      const fullHtml = p + "</p>";
      const isFirstParagraph = index === 0;

      elements.push(
        <p
          key={`p-${index}`}
          className={`my-5 font-sans text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed sm:leading-relaxed ${
            isFirstParagraph ? "first-letter:text-4xl first-letter:font-serif first-letter:font-extrabold first-letter:text-brand-500 first-letter:mr-2 first-letter:float-left first-letter:leading-none" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: fullHtml }}
        />
      );

      // Intersperse horizontal banner ad after paragraph 1, 3, 5... (capped at 16 max ads)
      const shouldInsertAd = (index === 0 || (index + 1) % 2 === 0) && insertedAdsCount < MAX_ADS_PER_PAGE;
      if (shouldInsertAd) {
        elements.push(
          <div key={`ad-${index}`} className="not-prose my-10 w-full text-center">
            <InContentAd />
          </div>
        );
        insertedAdsCount++;
      }
    });

    return (
      <div className={`space-y-2 font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}>
        {elements}
      </div>
    );
  }

  // Fallback for single block content without <p> tags
  return (
    <div className="space-y-6">
      <div
        className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {enableInArticleAds && (
        <div className="not-prose my-10 w-full text-center">
          <InContentAd />
        </div>
      )}
    </div>
  );
}
