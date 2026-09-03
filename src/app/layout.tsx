import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import NavigationProgress from "@/components/common/NavigationProgress";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Inter, Outfit, Roboto_Slab } from "next/font/google";
import { getValidMetadataBase } from "@/lib/url";

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
        {/* Adsterra Global Scripts: Social Bar, Floating Cards, Bottom Tab & Popunder */}
        <script
          async
          data-cfasync="false"
          src="https://pl31171504.profitableratecpmnetwork.com/6a/94/d8/6a94d8ced66908f1c8e6e72a1022ef24.js"
        />
        <script
          async
          data-cfasync="false"
          src="https://wailsilence.com/6a/94/d8/6a94d8ced66908f1c8e6e72a1022ef24.js"
        />
        <script
          async
          data-cfasync="false"
          src="https://wailsilence.com/5a/77/9f/5a779ffcc3c9736641795d9d4408d678.js"
        />
        <script
          async
          data-cfasync="false"
          src="https://pl31171502.profitableratecpmnetwork.com/5a/77/9f/5a779ffcc3c9736641795d9d4408d678.js"
        />
        <script
          async
          data-cfasync="false"
          src="https://wailsilence.com/tb6f07jgez?key=7204855da51379426dbb0d5c6c8933b7"
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
      <body className="h-full antialiased bg-gray-50 text-gray-900 dark:bg-[#090d16] dark:text-gray-100 font-sans selection:bg-brand-500 selection:text-white overflow-x-hidden">
        <Suspense fallback={null}>
          <NavigationProgress />
          <GoogleAnalytics />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
