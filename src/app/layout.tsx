import type { Metadata } from "next";
import { Inter, Noto_Serif_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AiProvider } from "@/components/providers/AiProvider";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Sidebar } from "@/components/ui/Sidebar";
import { AppShell } from "@/components/ui/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSerifJp = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFB7C5" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://yukisei.com"),
  title: {
    default: "Yukisei | AI & Data Engineering",
    template: "%s | Yukisei",
  },
  description: "Portafolio profesional de Francisco Calvo, Ingeniero en Sistemas especializado en Inteligencia Artificial, Data Engineering y Arquitectura Cloud.",
  keywords: ["AI Engineering", "Data Engineering", "Full Stack", "Francisco Calvo", "Yukisei", "Portfolio"],
  authors: [{ name: "Francisco Calvo" }],
  creator: "Francisco Calvo",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://yukisei.com",
    title: "Yukisei | AI & Data Engineering",
    description: "Portafolio profesional especializado en Inteligencia Artificial y Data Engineering.",
    siteName: "Yukisei",
    images: [
      {
        url: "/images/projects/Project_1.png",
        width: 1200,
        height: 630,
        alt: "Yukisei Portfolio Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yukisei | AI & Data Engineering",
    description: "Portafolio profesional especializado en Inteligencia Artificial y Data Engineering.",
    images: ["/images/projects/Project_1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${notoSerifJp.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col relative w-full">
        <LenisProvider>
          <ThemeProvider>
            <AiProvider>
              <AppShell>
                <Sidebar />
                <div className="flex-1 w-full md:pl-[240px] flex flex-col relative overflow-x-clip">
                  <ThemeToggle />
                  <AmbientBackground />
                  {children}
                </div>
              </AppShell>
            </AiProvider>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
