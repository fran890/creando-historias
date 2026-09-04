"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ADSTERRA_ADS_ENABLED,
  ADSTERRA_KEYS,
  isAdsterraRouteAllowed,
} from "@/lib/adsterra-config";

/**
 * Adsterra Popunder Loader:
 * Popunder (placement 31071003) is only activated on desktop devices (>= 1024px).
 * On mobile devices, popunders hijack navigation click events and open external ad tabs,
 * preventing users from reading article content.
 */
export default function AdsterraPopunder() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ADSTERRA_ADS_ENABLED || !isAdsterraRouteAllowed(pathname)) return;
    if (document.getElementById("adsterra-popunder")) return;

    // Only load Popunder on desktop screens where it can safely open in background
    if (window.innerWidth >= 1024) {
      const script = document.createElement("script");
      script.id = "adsterra-popunder";
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = ADSTERRA_KEYS.popunderScript;
      document.body.appendChild(script);
    }
  }, [pathname]);

  return null;
}
