"use client";

import React from "react";
import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
}

/**
 * Client component that renders article HTML content with:
 * - Optimized images (converted to Next.js WebP via /_next/image).
 * - Clean paragraph structure for SEO.
 * - Drop-cap styling for the first paragraph to enhance editorial aesthetics.
 * - NO in-content ads (ads are placed externally in the page layout for maximum performance).
 */
export default function ArticleReader({ content, className = "" }: ArticleReaderProps) {
  const optimizedContent = optimizeHtmlImages(content);

  if (optimizedContent.includes("</p>")) {
    const rawParagraphs = optimizedContent.split("</p>");
    const paragraphs = rawParagraphs.filter((p) => p.trim().length > 0);
    const elements: React.ReactNode[] = [];

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
    });

    return (
      <div className={`space-y-2 font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}>
        {elements}
      </div>
    );
  }

  // Fallback for single block content without <p> tags
  return (
    <div
      className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
    />
  );
}
