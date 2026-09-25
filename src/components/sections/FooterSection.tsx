"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export function FooterSection() {
  const { theme } = useTheme();
  const isNight = theme === "neon";

  return (
    <footer
      className="w-full mt-12 py-12 px-6 flex items-center justify-center border-t transition-colors duration-300"
      style={{
        borderColor: isNight ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
        background: isNight ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.5)",
      }}
      suppressHydrationWarning
    >
      <span
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
          color: isNight ? "rgba(255, 255, 255, 0.65)" : "#4b5563",
          fontWeight: 500,
        }}
      >
        &copy; 2026 Francisco Calvo &middot; M&eacute;xico
      </span>
    </footer>
  );
}
