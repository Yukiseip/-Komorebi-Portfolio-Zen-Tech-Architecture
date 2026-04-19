"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Howler } from "howler";

type Theme = "sakura" | "neon";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  setThemeDirectly: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // IMPORTANT: Always initialize to 'sakura' so server and client render identically.
  // The stored theme is applied in useEffect (client-only) to fix hydration mismatch.
  const [theme, setTheme] = useState<Theme>("sakura");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Restore stored theme preference after hydration (client-only)
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored && stored !== theme) {
      setTheme(stored);
    }
    setMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  // "use client" guarantees this runs only in the browser — no window guard needed.
  const playAmbientSound = (nextMode: Theme) => {
    try {
      if (!Howler.ctx) return;
      if (Howler.ctx.state === "suspended") Howler.ctx.resume();
      const oscillator = Howler.ctx.createOscillator();
      const gainNode   = Howler.ctx.createGain();
      oscillator.type  = "sine";
      const startFreq  = nextMode === "neon" ? 200 : 600;
      const endFreq    = nextMode === "neon" ? 50  : 1200;
      oscillator.frequency.setValueAtTime(startFreq, Howler.ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(endFreq, Howler.ctx.currentTime + 0.5);
      gainNode.gain.setValueAtTime(0.2, Howler.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, Howler.ctx.currentTime + 0.5);
      oscillator.connect(gainNode);
      gainNode.connect(Howler.ctx.destination);
      oscillator.start();
      oscillator.stop(Howler.ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio error", e);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextMode = prev === "sakura" ? "neon" : "sakura";
      playAmbientSound(nextMode);
      return nextMode;
    });
  };

  const setThemeDirectly = (newTheme: Theme) => {
    if (theme !== newTheme) {
      playAmbientSound(newTheme);
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeDirectly }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
