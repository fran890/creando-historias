import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import NavigationProgress from "@/components/common/NavigationProgress";
import { Inter, Outfit, Roboto_Slab } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreandoHistorias – Plataforma Editorial Multiusuario",
  description: "Plataforma editorial multiusuario con atribución transparente de ingresos, lectura optimizada y analíticas en tiempo real.",
  keywords: ["historias", "artículos", "blog", "editorial", "lectura", "creadores"],
  authors: [{ name: "CreandoHistorias Team" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";

  return (
    <html lang="es" className={`h-full scroll-smooth ${inter.variable} ${outfit.variable} ${robotoSlab.variable}`}>
      <head>
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full antialiased bg-gray-50 text-gray-900 dark:bg-[#090d16] dark:text-gray-100 font-sans selection:bg-brand-500 selection:text-white">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
