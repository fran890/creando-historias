"use client";

import Script from "next/script";
import { useEffect } from "react";

interface AdSenseScriptProps {
  clientId?: string;
}

export default function AdSenseScript({ clientId }: AdSenseScriptProps) {
  const adClientId = clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleAdError = (event: ErrorEvent) => {
        if (
          event.message?.includes("adsbygoogle") ||
          event.message?.includes("TagError") ||
          event.error?.name === "TagError"
        ) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      };
      window.addEventListener("error", handleAdError);
      return () => window.removeEventListener("error", handleAdError);
    }
  }, []);

  if (!adClientId) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
