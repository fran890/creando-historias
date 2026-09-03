"use client";

import { useEffect, useRef } from "react";

interface AdsterraAdProps {
  adKey?: string;
  format?: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Reusable Adsterra ad component.
 * Dynamically injects the atOptions config + invoke.js script into the DOM
 * at mount time so the ad renders correctly in React/Next.js.
 */
export default function AdsterraAd({
  adKey = "6dbb818f76a41d9fd7b276a64638934f",
  format = "iframe",
  width = 468,
  height = 60,
  className = "",
}: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || loadedRef.current) return;

    loadedRef.current = true;

    // 1. Inject atOptions config script (executes synchronously)
    const optionsScript = document.createElement("script");
    optionsScript.textContent = `
      atOptions = {
        'key' : '${adKey}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;
    container.appendChild(optionsScript);

    // 2. Inject invoke.js (loads async, reads atOptions, creates the ad iframe)
    const invokeScript = document.createElement("script");
    invokeScript.src = `https://wailsilence.com/${adKey}/invoke.js`;
    invokeScript.async = false; // ensure it runs after optionsScript
    container.appendChild(invokeScript);

    return () => {
      loadedRef.current = false;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [adKey, format, width, height]);

  return (
    <div
      ref={containerRef}
      className={`adsterra-ad flex justify-center items-center overflow-hidden w-full ${className}`}
      style={{ minHeight: height > 0 ? height : undefined }}
    />
  );
}
