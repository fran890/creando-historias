import { optimizeHtmlImages } from "@/lib/images";

interface ArticleReaderProps {
  content: string;
  className?: string;
}

export default function ArticleReader({ content, className = "" }: ArticleReaderProps) {
  const optimizedContent = optimizeHtmlImages(content);

  return (
    <div
      className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: optimizedContent }}
    />
  );
}
