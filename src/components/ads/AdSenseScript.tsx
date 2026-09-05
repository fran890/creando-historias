"use client";

import Script from "next/script";

interface AdSenseScriptProps {
  clientId?: string;
}

export default function AdSenseScript({
  clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195",
}: AdSenseScriptProps = {}) {
  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
