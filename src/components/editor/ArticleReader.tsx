"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { optimizeHtmlImages } from "@/lib/images";
import InContentAd from "@/components/ads/InContentAd";

interface ArticleReaderProps {
  content: string;
  className?: string;
  /** Whether to inject in-content ads between paragraphs. Defaults to true. */
  showAds?: boolean;
}

/**
 * Maximum number of in-content ad placements to inject.
 * Ads are evenly distributed between top-level block elements (p, h2, h3, ul, ol, blockquote, etc).
 */
const MAX_IN_CONTENT_ADS = 6;

/**
 * Minimum number of top-level block elements between consecutive ads
 * to avoid clustering ads too close together.
 */
const MIN_ELEMENTS_BETWEEN_ADS = 3;

export default function ArticleReader({ content, className = "", showAds = true }: ArticleReaderProps) {
  const optimizedContent = optimizeHtmlImages(content);
  const containerRef = useRef<HTMLDivElement>(null);
  const [adSlots, setAdSlots] = useState<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!showAds) {
      setAdSlots([]);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Collect all top-level block children (paragraphs, headings, lists, etc.)
    const children = Array.from(container.children).filter((el) => {
      const tag = el.tagName.toLowerCase();
      return ["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "blockquote", "figure", "div", "pre", "table"].includes(tag);
    });

    const totalBlocks = children.length;

    // Need at least enough blocks to space out ads
    if (totalBlocks < MIN_ELEMENTS_BETWEEN_ADS * 2) {
      setAdSlots([]);
      return;
    }

    // Calculate how many ads we can actually fit given spacing constraints
    const maxPossibleAds = Math.floor((totalBlocks - MIN_ELEMENTS_BETWEEN_ADS) / MIN_ELEMENTS_BETWEEN_ADS);
    const adsToInsert = Math.min(MAX_IN_CONTENT_ADS, maxPossibleAds);

    if (adsToInsert <= 0) {
      setAdSlots([]);
      return;
    }

    // Calculate the interval between ads (evenly distributed)
    const interval = Math.floor(totalBlocks / (adsToInsert + 1));

    // Remove any previously injected ad containers
    container.querySelectorAll(".in-content-ad-portal").forEach((el) => el.remove());

    const portals: HTMLDivElement[] = [];

    for (let i = 1; i <= adsToInsert; i++) {
      const insertAfterIndex = Math.min(i * interval - 1, totalBlocks - 1);
      const targetElement = children[insertAfterIndex];

      if (targetElement) {
        const portalDiv = document.createElement("div");
        portalDiv.className = "in-content-ad-portal";
        targetElement.insertAdjacentElement("afterend", portalDiv);
        portals.push(portalDiv);
      }
    }

    setAdSlots(portals);

    return () => {
      // Cleanup portal containers on unmount
      portals.forEach((p) => {
        if (p.parentNode) p.parentNode.removeChild(p);
      });
    };
  }, [optimizedContent, showAds]);

  return (
    <>
      <div
        ref={containerRef}
        className={`article-reader-content prose prose-lg md:prose-xl dark:prose-invert max-w-none font-sans text-lg sm:text-[19px] leading-[1.8] text-gray-900 dark:text-gray-100 ${className}`}
        dangerouslySetInnerHTML={{ __html: optimizedContent }}
      />
      {adSlots.map((slot, idx) =>
        createPortal(<InContentAd key={idx} index={idx} />, slot)
      )}
    </>
  );
}
