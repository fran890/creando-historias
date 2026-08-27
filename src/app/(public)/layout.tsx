import NavbarClient from "@/components/layout/NavbarClient";
import Footer from "@/components/layout/Footer";
import AdSenseScript from "@/components/ads/AdSenseScript";
import { isAutoAdSenseMode } from "@/lib/adsense-config";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const useAutoAds = isAutoAdSenseMode();

  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-editorial-ink dark:bg-gray-950 dark:text-gray-100 transition-colors">
      {useAutoAds && <AdSenseScript />}
      <NavbarClient user={null} hydrateSession />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
