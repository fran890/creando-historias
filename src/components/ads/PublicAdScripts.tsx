"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ADSTERRA_ADS_ENABLED,
  ADSTERRA_KEYS,
  isAdsterraRouteAllowed,
} from "@/lib/adsterra-config";

const DESKTOP_MIN_WIDTH = 1024;

function appendAdsterraScript(id: string, src: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = src;
  document.body.appendChild(script);
}

export default function PublicAdScripts() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ADSTERRA_ADS_ENABLED || !isAdsterraRouteAllowed(pathname)) return;
    if (window.innerWidth < DESKTOP_MIN_WIDTH) return;

    appendAdsterraScript("adsterra-social-bar", ADSTERRA_KEYS.socialBarScript);
    appendAdsterraScript("adsterra-popunder", ADSTERRA_KEYS.popunderScript);
  }, [pathname]);

  return null;
}
