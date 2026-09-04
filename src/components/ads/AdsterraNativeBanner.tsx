"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ADSTERRA_ADS_ENABLED,
  ADSTERRA_KEYS,
  isAdsterraRouteAllowed,
} from "@/lib/adsterra-config";

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
  const pathname = usePathname();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (!ADSTERRA_ADS_ENABLED || !isAdsterraRouteAllowed(pathname)) {
      wrapper.innerHTML = "";
      return;
    }

    wrapper.innerHTML = "";

    const containerId = `container-${ADSTERRA_KEYS.nativeBanner}`;
    const existingContainer = document.getElementById(containerId);
    if (existingContainer && !wrapper.contains(existingContainer)) {
      return;
    }

    const container = document.createElement("div");
    container.id = containerId;
    wrapper.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `https://pl31171503.profitableratecpmnetwork.com/${ADSTERRA_KEYS.nativeBanner}/invoke.js`;
    wrapper.appendChild(script);

    return () => {
      wrapper.innerHTML = "";
    };
  }, [pathname]);

  return (
    <div
      ref={wrapperRef}
      className={`adsterra-native-banner flex justify-center items-center overflow-hidden w-full max-w-full ${className}`}
    />
  );
}
