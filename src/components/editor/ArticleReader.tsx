"use client";

import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
}

export default function ArticleReader({ content, className = "" }: ArticleReaderProps) {
  const optimizedContent = optimizeHtmlImages(content);

  return (
    <div
      className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
    />
  );
}
