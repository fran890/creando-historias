"use client";

import { useEffect, useRef } from "react";

interface AdsterraNativeBannerProps {
  className?: string;
}

/**
 * Adsterra Native Banner ad component.
 * Uses the container-based approach with key 666fc12a09a07ad15eeca1a70b387d4b.
 * Appends a cache-busting timestamp to ensure the script executes on every mount/navigation.
 */
export default function AdsterraNativeBanner({ className = "" }: AdsterraNativeBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Reset container contents
    wrapper.innerHTML = "";

    // Create the container div that Adsterra's invoke.js looks for
    const container = document.createElement("div");
    container.id = "container-666fc12a09a07ad15eeca1a70b387d4b";
    wrapper.appendChild(container);

    // Load the invoke.js script with fresh timestamp
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `https://pl31171503.profitableratecpmnetwork.com/666fc12a09a07ad15eeca1a70b387d4b/invoke.js?_t=${Date.now()}`;
    wrapper.appendChild(script);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`adsterra-native-banner flex justify-center items-center overflow-hidden w-full max-w-full ${className}`}
    />
  );
}
