"use client";

import { useState, useEffect } from "react";

/**
 * Image component that defers base64 data URI rendering to the client side.
 * 
 * Problem: Base64 images (data:image/...) stored in the DB can be 1MB+.
 * When rendered in SSR HTML, they inflate the page to 2+ MB, causing
 * Google AdSense's previewer to fail with "loading issues".
 * 
 * Solution: For base64 images, render a lightweight placeholder during SSR,
 * then swap in the actual image on the client after hydration.
 * For normal HTTP URLs, render immediately (they're just short strings).
 */
export default function Base64SafeImage({
  src,
  alt,
  className,
  itemProp,
}: {
  src: string;
  alt: string;
  className?: string;
  itemProp?: string;
}) {
  const isBase64 = src.startsWith("data:");
  const [imageSrc, setImageSrc] = useState(isBase64 ? undefined : src);

  useEffect(() => {
    if (isBase64) {
      setImageSrc(src);
    }
  }, [src, isBase64]);

  if (!imageSrc) {
    // Lightweight placeholder during SSR for base64 images
    return (
      <div
        className={className}
        style={{ backgroundColor: "#e5e7eb", minHeight: 200 }}
        aria-label={alt}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      itemProp={itemProp}
      loading="lazy"
    />
  );
}
