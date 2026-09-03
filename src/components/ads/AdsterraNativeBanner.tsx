"use client";

import { useEffect, useRef } from "react";

interface AdsterraNativeBannerProps {
  className?: string;
}

/**
 * Adsterra Native Banner ad component.
 * Uses the container-based approach with key 666fc12a09a07ad15eeca1a70b387d4b.
 * This is a DIFFERENT ad zone from the iframe banner (AdsterraAd),
 * so it can show independently on the same page.
 */
export default function AdsterraNativeBanner({ className = "" }: AdsterraNativeBannerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || loadedRef.current) return;
    loadedRef.current = true;

    // Create the container div that Adsterra's invoke.js looks for
    const container = document.createElement("div");
    container.id = "container-666fc12a09a07ad15eeca1a70b387d4b";
    wrapper.appendChild(container);

    // Load the invoke.js script that fills the container
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = "https://pl31171503.profitableratecpmnetwork.com/666fc12a09a07ad15eeca1a70b387d4b/invoke.js";
    wrapper.appendChild(script);

    return () => {
      loadedRef.current = false;
      if (wrapper) wrapper.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`adsterra-native-banner flex justify-center items-center overflow-hidden w-full max-w-full ${className}`}
    />
  );
}
