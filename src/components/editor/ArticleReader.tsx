import React from "react";
import { sanitizeHtmlContent } from "@/lib/security/sanitizer";
import InContentAd from "@/components/ads/InContentAd";
import AdIntentPill from "@/components/ads/AdIntentPill";
import RelatedTopicsBox from "@/components/ads/RelatedTopicsBox";

interface ArticleReaderProps {
  content: string;
  className?: string;
  enableInArticleAds?: boolean;
}

export default function ArticleReader({ content, className = "", enableInArticleAds = true }: ArticleReaderProps) {
  const cleanHtml = sanitizeHtmlContent(content);

  if (enableInArticleAds && cleanHtml.includes("</p>")) {
    const paragraphs = cleanHtml.split("</p>");
    const elements: React.ReactNode[] = [];

    // Predefined topics for Intent Pills (matching user screenshot 3)
    const intentTopics = [
      "Historia",
      "Redes sociales",
      "Calculadoras y herramientas de referencia",
      "Psicología",
      "Tecnología",
    ];

    paragraphs.forEach((p, index) => {
      if (!p.trim()) return;
      let fullParagraphHtml = p + "</p>";

      // Periodically attach an interactive AdIntentPill to paragraphs
      const attachPill = (index + 1) % 2 === 0;
      const topicLabel = intentTopics[index % intentTopics.length];

      elements.push(
        <div key={`p-wrapper-${index}`}>
          <div dangerouslySetInnerHTML={{ __html: fullParagraphHtml }} />
          {attachPill && (
            <div className="my-1.5 flex items-center">
              <AdIntentPill label={topicLabel} />
            </div>
          )}
        </div>
      );

      // Insert "Ver más" topics box between paragraphs 2 and 3 (matching 3rd screenshot)
      if (index === 2) {
        elements.push(<RelatedTopicsBox key={`related-box-${index}`} />);
      }

      // Intersperse horizontal banner ad after every 2 paragraphs
      if ((index + 1) % 2 === 0 && index < paragraphs.length - 1) {
        elements.push(
          <InContentAd
            key={`ad-${index}`}
          />
        );
      }
    });

    return (
      <div className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}>
        {elements}
      </div>
    );
  }

  return (
    <div
      className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
