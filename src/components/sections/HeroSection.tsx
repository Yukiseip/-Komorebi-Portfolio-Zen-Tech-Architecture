"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const GREETINGS = ["¡Hola!", "Hello!", "こんにちは!", "你好!", "Привет!", "Bonjour!"];

function RotatingGreeting() {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % GREETINGS.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-9 sm:h-11 flex items-center justify-center mb-3 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className={`text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-widest
            ${theme === "sakura"
              ? "font-serif text-[#D13030]"
              : "font-mono text-[var(--accent-primary)] text-glow-cyan"}`}
        >
          {GREETINGS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ── Neon title with scan-line + glitch flash ──────────────────────────────────
function NeonGlitchTitle() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 160);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col items-center text-center w-full">

      {/* ── Scan line: isolated in its own overflow-hidden strip ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-[var(--accent-primary)]/25"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Main h1: NO overflow-hidden so text is never clipped ── */}
      <h1
        className={`relative z-20 font-mono font-black uppercase
          text-[var(--accent-primary)]
          transition-transform duration-75 ease-in-out
          text-[clamp(1.6rem,6.5vw,5.5rem)] tracking-[0.05em] sm:tracking-[0.08em] md:tracking-widest
          leading-tight
          ${glitch ? "translate-x-[2px] opacity-80" : ""}`}
        style={{ textShadow: "0 0 20px var(--accent-primary), 0 0 45px rgba(0,255,255,0.35)" }}
      >
        SYSTEM_ENGINEER
      </h1>

      {/* ── Chromatic aberration ghost ── */}
      <span
        aria-hidden
        className={`absolute z-10 inset-0 flex items-center justify-center
          font-mono font-black uppercase pointer-events-none select-none
          text-[clamp(1.6rem,6.5vw,5.5rem)] tracking-[0.05em] sm:tracking-[0.08em] md:tracking-widest
          text-[var(--accent-secondary)] leading-tight
          transition-all duration-75
          ${glitch ? "opacity-50 -translate-x-[3px]" : "opacity-0"}`}
      >
        SYSTEM_ENGINEER
      </span>

      <p className="relative z-20 mt-4 text-xs sm:text-sm md:text-lg font-mono text-[var(--text-secondary)] opacity-70 tracking-widest">
        &gt; INIT_PROTOCOL: TRUE
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export function HeroSection() {
  const { theme }  = useTheme();
  const ref        = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smoothProgress      = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });
  const y                   = useTransform(smoothProgress, [0, 1], ["0%", "45%"]);
  const opacity             = useTransform(smoothProgress, [0, 0.8], [1, 0]);

  return (
    <motion.section
      id="home"
      ref={ref}
      style={{ opacity }}
      className="relative flex items-center justify-center h-screen w-full overflow-hidden"
    >
      {/* Content wrapper */}
      <motion.div
        style={{ y }}
        className="flex flex-col items-center px-6 w-full"
      >
        <AnimatePresence mode="wait">
          {theme === "sakura" ? (
            /* ── DAY / SAKURA ── */
            <motion.div
              key="sakura"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center overflow-hidden w-full max-w-3xl"
            >
              <RotatingGreeting />
              <h1 className="font-serif text-[var(--text-primary)] tracking-tight mb-4 leading-tight
                text-[clamp(2rem,7vw,6rem)]">
                Ingeniero en Sistemas
              </h1>
              <p className="text-[clamp(1rem,2.5vw,1.5rem)] text-[var(--accent-primary)] font-light italic">
                Código con propósito. Diseño con alma.
              </p>
            </motion.div>
          ) : (
            /* ── NIGHT / NEON ── */
            <motion.div
              key="neon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center w-full max-w-5xl"
            >
              <RotatingGreeting />
              <NeonGlitchTitle />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <span className={`text-[10px] sm:text-xs mb-2 uppercase tracking-widest
          ${theme === "sakura" ? "font-serif" : "font-mono"}`}>
          {theme === "sakura" ? "Descubrir" : "SCROLL_DOWN"}
        </span>
        <div
          className={`w-px h-10 sm:h-12 ${theme === "sakura" ? "bg-[var(--text-secondary)]" : "bg-[var(--accent-primary)]"}`}
          style={theme === "neon" ? { boxShadow: "0 0 6px var(--accent-primary)" } : {}}
        />
      </motion.div>
    </motion.section>
  );
}
