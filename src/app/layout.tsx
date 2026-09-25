import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_JP, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AiProvider } from "@/components/providers/AiProvider";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Sidebar } from "@/components/ui/Sidebar";
import { AppShell } from "@/components/ui/AppShell";

// ── Fonts: latin-only subsets + display:swap removes them from critical path ──
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const notoSerifJp = Noto_Serif_JP({
  // Only load weight 400 for initial render; 700 (bold) deferred via CSS font-display
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
  preload: false, // non-critical decorative font — don't block initial render
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false, // used only in neon/code theme — non-critical for initial paint
});

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
    default: "Francisco Calvo Rodríguez | AI & Software Engineer · Portafolio (Yukisei)",
    template: "%s | Francisco Calvo Rodríguez",
  },
  description:
    "Portafolio profesional oficial de Francisco Calvo Rodríguez (Yukisei). Ingeniero especializado en Inteligencia Artificial, Data Science, Machine Learning y Desarrollo Full-Stack.",
  keywords: [
    "Francisco Calvo Rodríguez",
    "Francisco Calvo Rodriguez",
    "Francisco Calvo Rodrigues",
    "Francisco Calvo",
    "Francisco Calvo Ingeniero",
    "Francisco Calvo Portafolio",
    "Francisco Calvo Mexico",
    "Yukisei",
    "Yukiseip",
    "AI Engineer Mexico",
    "Desarrollador Inteligencia Artificial",
    "Data Science University of Tokyo",
    "Full Stack Developer",
    "Machine Learning Engineer",
    "Software Architecture",
  ],
  authors: [{ name: "Francisco Calvo Rodríguez", url: "https://yukisei.com" }],
  creator: "Francisco Calvo Rodríguez",
  alternates: {
    canonical: "https://yukisei.com",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://yukisei.com",
    title: "Francisco Calvo Rodríguez | Portafolio Oficial · AI & Software Engineer",
    description:
      "Portafolio oficial de Francisco Calvo Rodríguez (Yukisei). Proyectos en Inteligencia Artificial, Data Science y Desarrollo Web Moderno.",
    siteName: "Francisco Calvo Rodríguez (Yukisei)",
    images: [
      {
        url: "/images/projects/Proyecto1.jpg",
        width: 1200,
        height: 630,
        alt: "Francisco Calvo Rodríguez - Portafolio de Inteligencia Artificial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Francisco Calvo Rodríguez | Portafolio Oficial (Yukisei)",
    description:
      "Portafolio oficial de Francisco Calvo Rodríguez — Ingeniero en Inteligencia Artificial y Desarrollo Full-Stack.",
    images: ["/images/projects/Proyecto1.jpg"],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://yukisei.com/#person",
      name: "Francisco Calvo Rodríguez",
      alternateName: [
        "Francisco Calvo",
        "Francisco Calvo Rodriguez",
        "Francisco Calvo Rodrigues",
        "Yukisei",
        "Yukiseip",
        "Francisco CR",
      ],
      jobTitle: "Ingeniero de Software e Inteligencia Artificial",
      description:
        "Ingeniero en Sistemas especializado en Inteligencia Artificial, Data Science, Machine Learning y Desarrollo Full-Stack.",
      url: "https://yukisei.com",
      image: "https://yukisei.com/images/profile/imagen-personal.jpeg",
      nationality: {
        "@type": "Country",
        name: "Mexico",
      },
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "The University of Tokyo - Matsuo-Iwasawa Laboratory",
      },
      sameAs: [
        "https://github.com/Yukiseip",
        "https://www.linkedin.com/in/francisco-cr-50ba66401/",
        "https://www.youtube.com/@Yukiseif",
      ],
      knowsAbout: [
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Deep Learning",
        "Full-Stack Web Development",
        "Python",
        "TypeScript",
        "React",
        "Next.js",
        "Spring Boot",
        "PostgreSQL",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://yukisei.com/#website",
      url: "https://yukisei.com",
      name: "Francisco Calvo Rodríguez | Portafolio Oficial",
      description:
        "Portafolio profesional y proyectos de ingeniería de Francisco Calvo Rodríguez (Yukisei).",
      publisher: {
        "@id": "https://yukisei.com/#person",
      },
      inLanguage: "es-MX",
    },
  ],
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
      <head>
        {/* Preconnect to Google Fonts origins to reduce font critical-chain latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col relative w-full" suppressHydrationWarning>
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
