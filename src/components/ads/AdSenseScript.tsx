"use client";

import Script from "next/script";

interface AdSenseScriptProps {
  clientId?: string;
}

export default function AdSenseScript({ clientId }: AdSenseScriptProps) {
  const adClientId = clientId || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

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
