import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import NavigationProgress from "@/components/common/NavigationProgress";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Inter, Outfit, Roboto_Slab } from "next/font/google";
import { getValidMetadataBase } from "@/lib/url";

const AD_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";

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
  metadataBase: getValidMetadataBase(process.env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "Creando-Historias – Plataforma Editorial Multiusuario",
    template: "%s | Creando-Historias",
  },
  description: "Plataforma editorial multiusuario con atribución transparente de ingresos, lectura optimizada y analíticas en tiempo real.",
  keywords: ["historias", "artículos", "blog", "editorial", "lectura", "creadores"],
  authors: [{ name: "Creando-Historias Team" }],
  icons: {
    icon: "/logo-sin-fondo.png"
  },
  openGraph: {
    siteName: "Creando-Historias",
    locale: "es_ES",
    type: "website",
  },
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
  return (
    <html lang="es" className={`h-full scroll-smooth ${inter.variable} ${outfit.variable} ${robotoSlab.variable}`}>
      <head>
        {/* Official Google AdSense Tag for Site Verification & Auto-Ads (Desktop & Mobile Crawlers) */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        {/* Google Analytics (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-080W450VN1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-080W450VN1');
            `,
          }}
        />
      </head>
      <body className="h-full antialiased bg-gray-50 text-gray-900 dark:bg-[#090d16] dark:text-gray-100 font-sans selection:bg-brand-500 selection:text-white">
        <Suspense fallback={null}>
          <NavigationProgress />
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
