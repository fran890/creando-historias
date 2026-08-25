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

// Strict Directive: Maximum 16 ads per page
const MAX_ADS_PER_PAGE = 16;

export default function ArticleReader({ content, className = "", enableInArticleAds = true }: ArticleReaderProps) {
  const cleanHtml = sanitizeHtmlContent(content);

  // Flexible paragraph detection supporting <p>, </p>, <P>, </P>, or double line breaks
  const hasParagraphs = /<\/p>/i.test(cleanHtml) || /<br\s*\/?>/i.test(cleanHtml);

  if (enableInArticleAds && hasParagraphs) {
    // Split on closing paragraph tags case-insensitively
    const rawParagraphs = cleanHtml.split(/<\/p>/i);
    const paragraphs = rawParagraphs.filter((p) => p.trim().length > 0);
    const elements: React.ReactNode[] = [];
    let insertedAdsCount = 0;

    // Predefined topics for Intent Pills
    const intentTopics = [
      "Historia",
      "Redes sociales",
      "Calculadoras y herramientas de referencia",
      "Psicología",
      "Tecnología",
    ];

    paragraphs.forEach((p, index) => {
      let fullParagraphHtml = p.toLowerCase().includes("<p") ? p + "</p>" : `<p>${p}</p>`;

      // Attach an interactive AdIntentPill to paragraphs (hidden when AdSense active)
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

      // Insert "Ver más" topics box between paragraphs 2 and 3 (hidden when AdSense active)
      if (index === 1) {
        elements.push(<RelatedTopicsBox key={`related-box-${index}`} />);
      }

      // Intersperse horizontal in-content ad after paragraph 1, 3, 5... (strictly capped at 16 max ads)
      // Wrapped in 'not-prose' to prevent Tailwind typography from overriding AdSense styles
      const shouldInsertAd = (index === 0 || (index + 1) % 2 === 0) && insertedAdsCount < MAX_ADS_PER_PAGE;
      if (shouldInsertAd) {
        elements.push(
          <div key={`ad-wrapper-${index}`} className="not-prose my-[50px] w-full text-center">
            <InContentAd key={`ad-${index}`} />
          </div>
        );
        insertedAdsCount++;
      }
    });

    // Guaranteed fallback ad at the end of the article if 0 ads were inserted during paragraph loop
    if (insertedAdsCount === 0 && insertedAdsCount < MAX_ADS_PER_PAGE) {
      elements.push(
        <div key="ad-wrapper-end" className="not-prose my-[50px] w-full text-center">
          <InContentAd key="ad-end" />
        </div>
      );
    }

    return (
      <div className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}>
        {elements}
      </div>
    );
  }

  // Fallback for single block content without <p> tags: Always render 1 in-content ad at the bottom
  return (
    <div className="space-y-8">
      <div
        className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
      {enableInArticleAds && (
        <div className="not-prose my-[50px] w-full text-center">
          <InContentAd />
        </div>
      )}
    </div>
  );
}
