"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef } from "react";

// NOTE: Global SakuraCanvas petal rain removed intentionally.
// Petal effects are now localized to the HeroSection via PetalBurst (PetalEffects.tsx)
// to prevent petals from bleeding into adjacent sections.

/* ─── Neon retro-grid background ─────────────────────────────────────────── */
function NeonGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* Clean, subtle neon ambient glow without the animated road/grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0,255,255,0.05) 0%, transparent 80%)",
        }}
      />
    </div>
  );
}

/* ─── Sakura ambient background (clean, no petal rain) ──────────────────── */
function SakuraAmbient() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Soft radial gradient base */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,183,197,0.25) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────────── */
export function AmbientBackground() {
  const { theme } = useTheme();
  const isNeon = theme !== "sakura";

  // Mouse spotlight — throttled via rAF to avoid forced reflow on every mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use rAF to throttle updates and prevent layout thrashing
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
        rafId.current = null;
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [mouseX, mouseY]);

  // Mouse spotlight — neon mode only.
  const neonSpotlight = useMotionTemplate`radial-gradient(circle 600px at ${mouseX}px ${mouseY}px, rgba(0,255,255,0.13), transparent 80%)`;

  return (
    <>
      {/* Film grain noise overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.02] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Mouse spotlight — neon mode only (day/sakura mode has no spotlight) */}
      {isNeon && (
        <motion.div
          className="fixed inset-0 z-40 pointer-events-none mix-blend-screen"
          style={{ background: neonSpotlight }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
      )}

      {/* Theme backgrounds */}
      <AnimatePresence mode="wait">
        {theme === "sakura" ? (
          <motion.div
            key="sakura"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[-1]"
          >
            <SakuraAmbient />
          </motion.div>
        ) : (
          <motion.div
            key="neon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[-1]"
          >
            <NeonGrid />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
