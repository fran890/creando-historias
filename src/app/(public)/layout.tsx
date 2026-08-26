import NavbarClient from "@/components/layout/NavbarClient";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-editorial-bg text-editorial-ink dark:bg-gray-950 dark:text-gray-100 transition-colors">
      <NavbarClient user={null} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
