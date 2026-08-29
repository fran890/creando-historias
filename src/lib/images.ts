/**
 * Strips heavy embedded Base64 image data strings (> 500 chars) from HTML/strings.
 * Prevents bloating server HTML responses with 3MB base64 text payloads.
 */
export function stripBase64DataUris(text: string | null | undefined): string {
  if (!text) return "";
  return text.replace(
    /data:image\/[a-zA-Z+]+;base64,[a-zA-Z0-9+/=\s]{500,}/gi,
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
  );
}

export function getSafePublicImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("data:") && url.length > 50000) return null;
  return url;
}

/**
 * Converts image URLs to safe displayable URLs for <img> tags.
 * For Cloudflare R2, local /uploads/, and pre-optimized WebP images, returns direct URLs.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 1200,
  quality: number = 75
): string {
  if (!url) return "";

  // Data URIs: return if small, otherwise strip massive 3MB+ strings
  if (url.startsWith("data:")) {
    if (url.length < 50000) return url;
    return stripBase64DataUris(url);
  }

  // Relative paths (/uploads/...) return directly
  if (url.startsWith("/")) {
    return url;
  }

  // Cloudflare R2 URLs, S3 URLs, local dev URLs, or uploaded image files: return direct URL
  if (
    url.includes("r2.dev") ||
    url.includes("cloudflarestorage.com") ||
    url.includes("r2.") ||
    url.includes("localhost") ||
    url.includes("127.0.0.1") ||
    url.includes("uploads") ||
    url.endsWith(".webp") ||
    url.endsWith(".avif") ||
    url.endsWith(".png") ||
    url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".gif") ||
    url.endsWith(".svg")
  ) {
    return url;
  }

  // External unoptimized URLs (like unsplash) can pass through Next.js optimizer
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
  }

  return url;
}

/**
 * Optimizes all <img> tags in HTML content string.
 * Ensures Cloudflare R2 and uploaded images use direct, working URLs.
 */
export function optimizeHtmlImages(html: string, width: number = 800, quality: number = 75): string {
  if (!html) return "";

  return html.replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/gi, (match, p1, src, p2) => {
    if (src.includes("/_next/image")) return match;

    const optimizedSrc = getOptimizedImageUrl(src, width, quality);
    return `<img ${p1}src="${optimizedSrc}" loading="lazy" decoding="async" ${p2}>`;
  });
}

export function extractImageUrlsFromHtml(html: string | null | undefined): string[] {
  if (!html) return [];

  const urls = new Set<string>();
  const imageSrcPattern = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = imageSrcPattern.exec(html)) !== null) {
    if (match[1]) urls.add(match[1]);
  }

  return Array.from(urls);
}
