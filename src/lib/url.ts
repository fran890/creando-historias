export function getValidBaseUrl(rawUrl?: string): string {
  const fallback = "https://creando-historias.com";
  let urlStr = (rawUrl || "").trim();

  if (!urlStr) return fallback;

  if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
    if (!urlStr.includes(".")) {
      urlStr = `${urlStr}.com`;
    }
    urlStr = `https://${urlStr}`;
  }

  try {
    const parsed = new URL(urlStr);
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export function getValidMetadataBase(rawUrl?: string): URL {
  return new URL(getValidBaseUrl(rawUrl));
}
