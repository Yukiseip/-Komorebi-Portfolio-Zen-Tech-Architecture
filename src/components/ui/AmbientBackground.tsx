"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";

// NOTE: Global SakuraCanvas petal rain removed intentionally.
// Petal effects are now localized to the HeroSection via PetalBurst (PetalEffects.tsx)
// to prevent petals from bleeding into adjacent sections.

/* ─── Neon retro-grid background ─────────────────────────────────────────── */
function NeonGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050505] opacity-80">
      {/* Perspective wrapper */}
      <div className="absolute inset-0 perspective-[1000px] flex items-center justify-center">
        {/* Animated Grid */}
        <motion.div
          className="absolute bottom-[-50%] w-[200%] h-[150%] border-t-[1px] border-[#00FFFF]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00FFFF 1px, transparent 1px),
              linear-gradient(to bottom, #00FFFF 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transformOrigin: "top",
            rotateX: "70deg",
            boxShadow: "inset 0 0 100px #FF00FF",
            willChange: "transform",  // only transform composites on GPU
          }}
          animate={{ backgroundPosition: ["0px 0px", "0px 50px"] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      {/* Horizon Fade */}
      <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#050505] via-[#050505] to-transparent z-10" />
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

  // Parallax spring — only needed for the Neon retro-grid.
  // Computed unconditionally (hooks can't be conditional) but only
  // consumed inside the neon branch, so the spring is cheaply idle in sakura.
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 1000, damping: 100 });
  const yParallax = useTransform(smoothScrollY, [0, 5000], [0, 500]);

  // Mouse spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Mouse spotlight — neon mode only.
  // In sakura (day) mode the spotlight is disabled to avoid the white glow
  // washing out light-colored content.
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
            style={{ y: yParallax }}
          >
            <NeonGrid />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
