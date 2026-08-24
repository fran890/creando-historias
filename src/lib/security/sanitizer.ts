import DOMPurify from "dompurify";

export function sanitizeHtmlContent(dirtyHtml: string): string {
  if (typeof window === "undefined") {
    // Server-side fallback sanitization removing dangerous scripts & inline event handlers
    return dirtyHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/\s+on\w+="[^"]*"/gi, "")
      .replace(/\s+on\w+='[^']*'/gi, "");
  }

  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "b", "i", "strong", "em",
      "a", "ul", "ol", "li", "blockquote", "img", "hr", "br", "span", "div", "pre", "code"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "class"],
  });
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const textOnly = content.replace(/<[^>]*>/g, " ");
  const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
}
