"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const GREETINGS = ["¡Hola!", "Hello!", "こんにちは!", "你好!", "Привет!", "Bonjour!"];

function RotatingGreeting() {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 md:h-12 flex items-center justify-center mb-2 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={`text-xl md:text-2xl font-bold uppercase tracking-widest
            ${theme === "sakura" ? "font-serif text-[#D13030]" : "font-mono text-[var(--accent-primary)] text-glow-cyan"}
          `}
        >
          {GREETINGS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ── Neon scan-line animation (PC + mobile) ────────────────────────────────────
function NeonGlitchTitle() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Trigger a glitch flash every ~4s
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* Main title */}
      <h1
        className={`text-[2.6rem] sm:text-5xl md:text-7xl lg:text-8xl font-mono font-bold uppercase tracking-widest
          text-[var(--accent-primary)]
          transition-transform duration-75
          ${glitch ? "translate-x-[2px] opacity-80" : ""}`}
        style={{ textShadow: "0 0 18px var(--accent-primary), 0 0 40px rgba(0,255,255,0.4)" }}
      >
        SYSTEM_ENGINEER
      </h1>

      {/* Chromatic glitch layer (behind) */}
      <span
        aria-hidden
        className={`absolute inset-0 flex items-center justify-center
          text-[2.6rem] sm:text-5xl md:text-7xl lg:text-8xl font-mono font-bold uppercase tracking-widest
          text-[var(--accent-secondary)] opacity-0 pointer-events-none
          transition-opacity duration-75 select-none
          ${glitch ? "opacity-60 translate-x-[-4px]" : ""}`}
        style={{ top: 0 }}
      >
        SYSTEM_ENGINEER
      </span>

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-[var(--accent-primary)]/30 pointer-events-none"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <p className="mt-6 text-base sm:text-xl md:text-2xl font-mono text-[var(--text-secondary)] opacity-80 px-4">
        &gt; INIT_PROTOCOL: TRUE
      </p>
    </div>
  );
}

export function HeroSection() {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });
  const y       = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);

  return (
    <motion.section
      id="home"
      ref={ref}
      style={{ opacity }}
      className="relative flex items-center justify-center h-screen w-full overflow-hidden"
    >
      <motion.div style={{ y }} className="flex flex-col items-center px-4 w-full max-w-4xl">
        {theme === "sakura" ? (
          /* ── DAY / SAKURA ── */
          <motion.div
            initial={{ opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
            animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center overflow-hidden"
          >
            <RotatingGreeting />
            <h1 className="text-[2.6rem] sm:text-5xl md:text-7xl lg:text-8xl font-serif text-[var(--text-primary)] tracking-tight mb-4 leading-tight">
              Ingeniero en Sistemas
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[var(--accent-primary)] font-light italic px-4">
              Código con propósito. Diseño con alma.
            </p>
          </motion.div>
        ) : (
          /* ── NIGHT / NEON ── */
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center w-full"
          >
            <RotatingGreeting />
            <NeonGlitchTitle />
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <span className={`text-xs sm:text-sm mb-2 ${theme === "sakura" ? "font-serif" : "font-mono uppercase"}`}>
          {theme === "sakura" ? "Descubrir" : "Scroll_Down"}
        </span>
        <div className={`w-[1px] h-10 sm:h-12 ${theme === "sakura" ? "bg-[var(--text-secondary)]" : "bg-[var(--accent-primary)]"}`}
          style={theme === "neon" ? { boxShadow: "0 0 8px var(--accent-primary)" } : {}}
        />
      </motion.div>
    </motion.section>
  );
}
