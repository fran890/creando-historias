import NavbarClient from "@/components/layout/NavbarClient";
import Footer from "@/components/layout/Footer";
import PublicAdScripts from "@/components/ads/PublicAdScripts";
import AdSenseScript from "@/components/ads/AdSenseScript";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-editorial-ink dark:bg-gray-950 dark:text-gray-100 transition-colors">
      <AdSenseScript />
      <PublicAdScripts />
      <NavbarClient user={null} hydrateSession />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
