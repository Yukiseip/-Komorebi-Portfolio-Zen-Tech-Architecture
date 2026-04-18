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
  // Read localStorage synchronously so there's no flash on first load.
  // The function is only called once during initialization (lazy initializer).
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'sakura'; // SSR default
    return (localStorage.getItem('theme') as Theme) ?? 'sakura';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  const playAmbientSound = (nextMode: Theme) => {
    try {
      if (typeof window !== "undefined" && window.AudioContext) {
        if (Howler.ctx && Howler.ctx.state === "suspended") {
          Howler.ctx.resume();
        }
        if (!Howler.ctx) return;
        
        const oscillator = Howler.ctx.createOscillator();
        const gainNode = Howler.ctx.createGain();
        oscillator.type = "sine";
        
        const startFreq = nextMode === 'neon' ? 200 : 600;
        const endFreq = nextMode === 'neon' ? 50 : 1200;
        
        oscillator.frequency.setValueAtTime(startFreq, Howler.ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, Howler.ctx.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.2, Howler.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, Howler.ctx.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(Howler.ctx.destination);
        
        oscillator.start();
        oscillator.stop(Howler.ctx.currentTime + 0.5);
      }
    } catch(e) {
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
      <div style={{ display: mounted ? "contents" : "contents" }}>
        {children}
      </div>
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
