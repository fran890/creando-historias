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
  return (
    <html lang="es" className="h-full">
      <body className="h-full antialiased bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
