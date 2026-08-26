/**
 * Strips heavy embedded Base64 image data strings (> 200 chars) from HTML/strings.
 * Prevents bloating server HTML responses with 3MB base64 text payloads.
 */
export function stripBase64DataUris(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(
    /data:image\/[a-zA-Z+]+;base64,[a-zA-Z0-9+/=\s]{200,}/gi,
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  );
}

/**
 * Converts any image URL to Next.js Image Optimizer URL.
 * Automatically resizes high-res images and converts them to compressed WebP/AVIF format.
 * Reduces 3MB-5MB original photos to ~50KB-90KB WebP images (98% size reduction).
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 1200,
  quality: number = 75
): string {
  if (!url) return "";
  
  // If it's a base64 data URI, don't pass raw 3MB text
  if (url.startsWith("data:")) {
    return stripBase64DataUris(url);
  }

  // If relative path, return as is
  if (url.startsWith("/")) {
    return url;
  }

  // Pass external HTTP/HTTPS images through Next.js Image Optimizer
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
  }

  return url;
}

/**
 * Optimizes all <img> tags in HTML content string.
 * Strips heavy 3MB base64 strings and converts raw <img src="http..."> to Next.js WebP URLs.
 */
export function optimizeHtmlImages(html: string, width: number = 800, quality: number = 75): string {
  if (!html) return "";

  // 1. Strip massive inline base64 image data strings
  const cleanedHtml = stripBase64DataUris(html);

  // 2. Convert HTTP/HTTPS <img> tags to Next.js optimized WebP URLs
  return cleanedHtml.replace(/<img\s+([^>]*?)src=["'](https?:\/\/[^"']+)["']([^>]*?)>/gi, (match, p1, src, p2) => {
    if (src.includes("/_next/image")) return match;

    const optimizedSrc = getOptimizedImageUrl(src, width, quality);
    return `<img ${p1}src="${optimizedSrc}" loading="lazy" decoding="async" ${p2}>`;
  });
}
