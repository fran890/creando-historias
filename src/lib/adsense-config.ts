export type AdSenseMode = "manual" | "auto";

export function getAdSenseMode(): AdSenseMode {
  return process.env.NEXT_PUBLIC_ADSENSE_MODE === "auto" ? "auto" : "manual";
}

export function isManualAdSenseMode(): boolean {
  return getAdSenseMode() === "manual";
}

export function isAutoAdSenseMode(): boolean {
  return getAdSenseMode() === "auto";
}
