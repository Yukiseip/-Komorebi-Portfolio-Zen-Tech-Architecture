import type { Metadata } from "next";
import { Inter, Noto_Serif_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AiProvider } from "@/components/providers/AiProvider";

import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Sidebar } from "@/components/ui/Sidebar";

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

export const metadata: Metadata = {
  title: "Komorebi Neon Portfolio",
  description: "Portafolio interactivo de Ingeniero en Sistemas",
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
      <body className="min-h-full flex flex-col relative w-full overflow-x-hidden">
        <LenisProvider>
          <ThemeProvider>
            <AiProvider>
              <Sidebar />
              <div className="flex-1 w-full md:pl-[240px] flex flex-col relative">
                <ThemeToggle />
                <AmbientBackground />
                {children}
              </div>
            </AiProvider>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
