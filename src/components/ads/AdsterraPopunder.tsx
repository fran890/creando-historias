"use client";

import { useEffect } from "react";

/**
 * Adsterra Popunder Loader:
 * Popunder (placement 31071003) is only activated on desktop devices (>= 1024px).
 * On mobile devices, popunders hijack navigation click events and open external ad tabs,
 * preventing users from reading article content.
 */
export default function AdsterraPopunder() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Only load Popunder on desktop screens where it can safely open in background
    if (window.innerWidth >= 1024) {
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://wailsilence.com/5a/77/9f/5a779ffcc3c9736641795d9d4408d678.js";
      document.body.appendChild(script);
    }
  }, []);

  return null;
}
