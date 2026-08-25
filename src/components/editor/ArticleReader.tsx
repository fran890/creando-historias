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
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";
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
      let innerText = p.replace(/^<p[^>]*>/i, "").trim();
      if (!innerText) return;

      const topicLabel = intentTopics[index % intentTopics.length];
      const attachPill = (index + 1) % 2 === 0;

      // Clean paragraph element directly without extra nested wrapper divs so AdSense DOM parser finds sibling <p> tags
      elements.push(
        <p key={`p-${index}`} className="my-4 font-sans text-base sm:text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: innerText }} />
          {attachPill && !adClientId && (
            <span className="inline-block ml-2">
              <AdIntentPill label={topicLabel} />
            </span>
          )}
        </p>
      );

      // Insert "Ver más" topics box between paragraphs 2 and 3 (hidden in production when AdSense is active)
      if (index === 1 && !adClientId) {
        elements.push(<RelatedTopicsBox key={`related-box-${index}`} />);
      }

      // Intersperse horizontal in-content ad after paragraph 1, 3, 5... (strictly capped at 16 max ads)
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

    return (
      <div className={`space-y-4 font-serif leading-relaxed text-gray-800 dark:text-gray-200 ${className}`}>
        {elements}
      </div>
    );
  }

  // Fallback for single block content without <p> tags: Always render clean paragraphs & 1 in-content ad at bottom
  return (
    <div className="space-y-6">
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
