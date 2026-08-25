"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Global navigation progress indicator & click interceptor.
 * 
 * Provides 0ms instant visual feedback when a user clicks any internal link:
 * 1. Animates a glowing top progress bar across the screen.
 * 2. Displays a subtle floating spinner with "Cargando...".
 * 3. Blocks pointer events temporarily to prevent accidental double-clicks.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress bar when route/pathname or searchParams changes
  useEffect(() => {
    setIsNavigating(false);
    setProgress(100);

    const timer = setTimeout(() => {
      setProgress(0);
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger immediate loading state
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const targetAttr = anchor.getAttribute("target");

      // Only handle internal links without target="_blank" or download
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        targetAttr !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        // If navigating to a different URL path or search param
        const currentUrl = `${window.location.pathname}${window.location.search}`;
        if (href !== currentUrl) {
          setIsNavigating(true);
          setProgress(25);

          // Increment progress simulation
          const interval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 90) {
                clearInterval(interval);
                return 90;
              }
              return prev + Math.floor(Math.random() * 15) + 5;
            });
          }, 150);
        }
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <>
      {/* Top Glowing Brand Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gray-200/20 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-amber-500 shadow-[0_0_12px_rgba(233,30,99,0.8)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Full-screen Overlay & Spinner when Navigating (Blocks clicks) */}
      {isNavigating && (
        <div className="fixed inset-0 z-[9998] bg-black/15 dark:bg-black/40 backdrop-blur-[1px] flex items-center justify-center cursor-wait animate-fade-in">
          <div className="bg-white/95 dark:bg-gray-900/95 border border-gray-200 dark:border-gray-800 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold text-gray-900 dark:text-white">
            <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
            <span>Cargando publicación...</span>
          </div>
        </div>
      )}
    </>
  );
}
