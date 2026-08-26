"use client";

/**
 * Ultra-Optimized Lazy AdSense Loader
 * 
 * Prevents loading ~1.4MB of Google AdSense scripts (show_ads_impl, sodar2, zrt_lookup)
 * until:
 * 1. `NEXT_PUBLIC_ENABLE_ADSENSE` is NOT "false".
 * 2. The user actually interacts with the page (scrolls down 100px or touches/moves mouse).
 * 3. An ad container is visible in the viewport.
 */

let adsenseLoadState: "idle" | "loading" | "loaded" | "error" = "idle";
let adsenseLoadPromise: Promise<void> | null = null;
let userHasInteracted = false;
const pendingUnits: HTMLElement[] = [];

const AD_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";

// Enable flag: can be explicitly set to "false" in env while account is under review
const IS_ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ADSENSE !== "false";

/**
 * Listen for initial user scroll/touch/move interaction before loading AdSense scripts.
 */
if (typeof window !== "undefined" && IS_ADSENSE_ENABLED) {
  const onUserInteraction = () => {
    userHasInteracted = true;
    window.removeEventListener("scroll", onUserInteraction);
    window.removeEventListener("touchstart", onUserInteraction);
    window.removeEventListener("mousemove", onUserInteraction);
    
    // Flush any pending units once user interacts
    if (pendingUnits.length > 0) {
      loadAdSenseScript().catch(() => {});
    }
  };

  window.addEventListener("scroll", onUserInteraction, { passive: true, once: true });
  window.addEventListener("touchstart", onUserInteraction, { passive: true, once: true });
  window.addEventListener("mousemove", onUserInteraction, { passive: true, once: true });
}

/**
 * Loads the AdSense script tag into the document head exactly once.
 */
function loadAdSenseScript(): Promise<void> {
  if (!IS_ADSENSE_ENABLED) return Promise.resolve();
  if (adsenseLoadState === "loaded") return Promise.resolve();
  if (adsenseLoadPromise) return adsenseLoadPromise;

  adsenseLoadState = "loading";

  adsenseLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(
      `script[src*="adsbygoogle.js?client=${AD_CLIENT_ID}"]`
    );
    if (existing) {
      adsenseLoadState = "loaded";
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      adsenseLoadState = "loaded";
      pendingUnits.forEach((el) => pushUnit(el));
      pendingUnits.length = 0;
      resolve();
    };

    script.onerror = () => {
      adsenseLoadState = "error";
      pendingUnits.length = 0;
      reject(new Error("AdSense script failed to load"));
    };

    document.head.appendChild(script);
  });

  return adsenseLoadPromise;
}

/**
 * Push a single ad unit to adsbygoogle.
 */
function pushUnit(element: HTMLElement): void {
  if (
    element.getAttribute("data-adsbygoogle-status") ||
    element.getAttribute("data-ad-status")
  ) {
    return;
  }

  const width = element.clientWidth || element.offsetWidth;
  if (width <= 0) return;

  try {
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
    (window as any).adsbygoogle.push({});
  } catch {
    // Silently ignore errors
  }
}

/**
 * Register an ad unit element.
 * Defers loading until element is in viewport AND user has scrolled/interacted.
 */
export function registerAdUnit(element: HTMLElement | null): () => void {
  if (!element || !IS_ADSENSE_ENABLED) return () => {};
  if (typeof window === "undefined") return () => {};

  if (
    element.getAttribute("data-adsbygoogle-status") ||
    element.getAttribute("data-ad-status")
  ) {
    return () => {};
  }

  let observer: IntersectionObserver | null = null;

  if (typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer?.disconnect();
            observer = null;

            pendingUnits.push(element);

            // Only trigger download if user has actually scrolled/interacted with the page
            if (userHasInteracted || window.scrollY > 50) {
              if (adsenseLoadState === "loaded") {
                pushUnit(element);
              } else {
                loadAdSenseScript().catch(() => {});
              }
            }
            break;
          }
        }
      },
      { rootMargin: "50px" }
    );

    observer.observe(element);
  }

  return () => {
    observer?.disconnect();
  };
}
