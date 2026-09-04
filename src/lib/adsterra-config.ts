export const ADSTERRA_ADS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ADSTERRA === "true" ||
  process.env.NODE_ENV === "production";

export const ADSTERRA_ROUTES_WITHOUT_ADS = [
  "/about",
  "/contact",
  "/cookies",
  "/login",
  "/privacy",
  "/sobre-nosotros",
  "/terms",
] as const;

export const ADSTERRA_KEYS = {
  display468x60: "6dbb818f76a41d9fd7b276a64638934f",
  headerDesktop728x90: "7dc4efd221856c7cc01bfcaa22b2c289",
  headerMobile320x50: "38e93328cc31a4d67bb5967d1a57b595",
  nativeBanner: "666fc12a09a07ad15eeca1a70b387d4b",
  popunderScript: "https://wailsilence.com/5a/77/9f/5a779ffcc3c9736641795d9d4408d678.js",
  socialBarScript: "https://wailsilence.com/6a/94/d8/6a94d8ced66908f1c8e6e72a1022ef24.js",
} as const;

export function isAdsterraRouteAllowed(pathname: string | null | undefined) {
  if (!pathname) return false;
  return !ADSTERRA_ROUTES_WITHOUT_ADS.some(
    (blockedPath) => pathname === blockedPath || pathname.startsWith(`${blockedPath}/`)
  );
}
