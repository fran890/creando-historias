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
 * Each ad key can only show ONCE per page.
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
    invokeScript.src = `https://wailsilence.com/${adKey}/invoke.js`;
    invokeScript.async = false;
    container.appendChild(invokeScript);

    return () => {
      loadedRef.current = false;
      if (container) container.innerHTML = "";
    };
  }, [adKey, format, width, height]);

  return (
    <div
      ref={containerRef}
      className={`adsterra-ad flex justify-center items-center overflow-hidden w-full max-w-full ${className}`}
    />
  );
}
