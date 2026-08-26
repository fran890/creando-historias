"use client";

import React from "react";
import InContentAd from "@/components/ads/InContentAd";
import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
  enableInArticleAds?: boolean;
}

const MAX_ADS_PER_PAGE = 2;

/**
 * Client component that renders article HTML content with:
 * - Clean paragraph structure (<p> elements) for AdSense Auto-Ads.
 * - In-content ads interspersed between paragraphs (max 2 per article for peak performance).
 * - Drop-cap styling for the first paragraph to enhance editorial aesthetics.
 */
export default function ArticleReader({ content, className = "", enableInArticleAds = true }: ArticleReaderProps) {
  const optimizedContent = optimizeHtmlImages(content);

  if (enableInArticleAds && optimizedContent.includes("</p>")) {
    const rawParagraphs = optimizedContent.split("</p>");
    const paragraphs = rawParagraphs.filter((p) => p.trim().length > 0);
    const elements: React.ReactNode[] = [];
    let insertedAdsCount = 0;

    paragraphs.forEach((p, index) => {
      let fullHtml = p.trim();
      if (!fullHtml.startsWith("<p")) {
        fullHtml = `<p>${fullHtml}</p>`;
      } else {
        fullHtml = `${fullHtml}</p>`;
      }
      const isFirstParagraph = index === 0;

      elements.push(
        <div
          key={`p-${index}`}
          className={`my-5 font-sans text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed sm:leading-relaxed ${
            isFirstParagraph ? "[&>p:first-of-type]:first-letter:text-4xl [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:font-extrabold [&>p:first-of-type]:first-letter:text-brand-500 [&>p:first-of-type]:first-letter:mr-2 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:leading-none" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: fullHtml }}
        />
      );

      // Intersperse horizontal banner ad after paragraph 2 and 6 (capped at 2 max in-article ads for ultra fast page load)
      const shouldInsertAd = (index === 2 || index === 6) && insertedAdsCount < MAX_ADS_PER_PAGE;
      if (shouldInsertAd) {
        elements.push(
          <div key={`ad-${index}`} className="not-prose my-8 w-full text-center">
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
