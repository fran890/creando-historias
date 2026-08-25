import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CreandoHistorias – Plataforma Editorial Multiusuario",
  description: "Plataforma editorial multiusuario con atribución transparente de ingresos y analíticas en tiempo real.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-6105500451798195";

  return (
    <html lang="es" className="h-full">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="h-full antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
