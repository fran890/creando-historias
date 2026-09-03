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
 * Adsterra iframe banner ad component.
 * Appends fresh timestamp to invoke.js so Next.js route transitions and remounts
 * always re-execute the ad loader script.
 */
export default function AdsterraAd({
  adKey = "6dbb818f76a41d9fd7b276a64638934f",
  format = "iframe",
  width = 468,
  height = 60,
  className = "",
}: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset container contents
    container.innerHTML = "";

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

    const invokeScript = document.createElement("script");
    invokeScript.src = `https://wailsilence.com/${adKey}/invoke.js?_t=${Date.now()}`;
    invokeScript.async = false;
    container.appendChild(invokeScript);
  }, [adKey, format, width, height]);

  return (
    <div
      ref={containerRef}
      className={`adsterra-ad flex justify-center items-center overflow-hidden w-full max-w-full ${className}`}
    />
  );
}
