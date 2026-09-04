"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ADSTERRA_ADS_ENABLED,
  ADSTERRA_KEYS,
  isAdsterraRouteAllowed,
} from "@/lib/adsterra-config";

interface AdsterraAdProps {
  adKey?: string;
  format?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Adsterra iframe banner ad component.
 * Loads display slots through a small client-side queue so the global atOptions
 * handoff is less likely to collide when multiple slots mount together.
 */
let adsterraDisplayQueue = Promise.resolve();

export default function AdsterraAd({
  adKey = ADSTERRA_KEYS.display468x60,
  format = "iframe",
  width = 468,
  height = 60,
  className = "",
}: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!ADSTERRA_ADS_ENABLED || !isAdsterraRouteAllowed(pathname)) {
      container.innerHTML = "";
      return;
    }

    let cancelled = false;

    container.innerHTML = "";

    adsterraDisplayQueue = adsterraDisplayQueue
      .catch(() => undefined)
      .then(
        () =>
          new Promise<void>((resolve) => {
            if (cancelled || !container.isConnected) {
              resolve();
              return;
            }

            const optionsScript = document.createElement("script");
            optionsScript.textContent = `
              window.atOptions = {
                'key' : '${adKey}',
                'format' : '${format}',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
              };
            `;
            container.appendChild(optionsScript);

            const invokeScript = document.createElement("script");
            invokeScript.src = `https://wailsilence.com/${adKey}/invoke.js`;
            invokeScript.async = false;
            invokeScript.onload = () => resolve();
            invokeScript.onerror = () => resolve();
            container.appendChild(invokeScript);
          })
      );

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [adKey, format, width, height, pathname]);

  return (
    <div
      ref={containerRef}
      className={`adsterra-ad flex justify-center items-center overflow-hidden w-full max-w-full ${className}`}
    />
  );
}
