import "./globals.css";
import type { Metadata, Viewport } from "next";

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
    <html lang="es" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Roboto+Slab:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full antialiased bg-gray-50 text-gray-900 dark:bg-[#090d16] dark:text-gray-100 font-sans selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
