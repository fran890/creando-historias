export type AdSenseMode = "manual" | "auto";

export function getAdSenseMode(): AdSenseMode {
  return "manual";
}

export function isManualAdSenseMode(): boolean {
  return false;
}

export function isAutoAdSenseMode(): boolean {
  return false;
}
