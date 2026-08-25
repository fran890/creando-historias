"use client";

/**
 * Safely initializes a Google AdSense <ins className="adsbygoogle"> unit.
 * 
 * Prevents:
 * 1. "TagError: adsbygoogle.push() error: No slot size for availableWidth=0"
 *    by deferring push until the DOM element has a positive clientWidth (> 0).
 * 2. Duplicate pushes on re-renders.
 * 3. Uncaught exceptions from AdBlockers or strict CSP environments.
 */
export function pushAdSenseUnit(adElement: HTMLElement | null): () => void {
  if (!adElement) return () => {};

  // Check if already initialized
  if (
    adElement.getAttribute("data-adsbygoogle-status") ||
    adElement.getAttribute("data-ad-status")
  ) {
    return () => {};
  }

  let cleanupFn = () => {};

  const tryPush = () => {
    if (
      adElement.getAttribute("data-adsbygoogle-status") ||
      adElement.getAttribute("data-ad-status")
    ) {
      return true;
    }

    // Measure available layout width
    const width = adElement.clientWidth || adElement.offsetWidth;
    if (width <= 0) {
      return false; // Not ready yet (0 width)
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      return true;
    } catch (err: any) {
      // Catch TagError or AdBlocker errors gracefully without throwing in console
      if (process.env.NODE_ENV !== "production") {
        console.warn("[AdSense] Deferred push warning:", err?.message || err);
      }
      return true;
    }
  };

  // 1. Immediate attempt if element already has width
  if (tryPush()) {
    return () => {};
  }

  // 2. If clientWidth is 0 (e.g. initial render or iframe layout), use ResizeObserver
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          if (tryPush()) {
            observer.disconnect();
          }
        }
      }
    });

    observer.observe(adElement);
    cleanupFn = () => observer.disconnect();
  } else {
    // Fallback timer if ResizeObserver is unavailable
    const timer = setTimeout(() => {
      tryPush();
    }, 300);
    cleanupFn = () => clearTimeout(timer);
  }

  return cleanupFn;
}
