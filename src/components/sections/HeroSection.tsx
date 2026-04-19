"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { GatewayAnimation } from "@/components/ui/GatewayAnimation";
import { PetalBurst } from "@/components/ui/PetalEffects";

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */

const GREETINGS = [
  "¡Hola!",
  "こんにちは",
  "Hello!",
  "你好",
  "Привет!",
  "Bonjour!",
  "안녕하세요",
  "مرحبا",
];

const TYPEWRITER_SPEED  = 80;   // ms per character
const ERASE_SPEED       = 45;   // ms per character
const PAUSE_AFTER_TYPE  = 1400; // ms hold before erasing
const PAUSE_AFTER_ERASE = 300;  // ms between words

/* ─────────────────────────────────────────────────────────────────────────────
   TypewriterGreeting
   Cycles through GREETINGS with a typewriter effect.
   Fires onLanguageChange callback each time a new word starts typing.
───────────────────────────────────────────────────────────────────────────── */

function TypewriterGreeting({
  onLanguageChange,
}: {
  onLanguageChange: () => void;
}) {
  const { theme } = useTheme();
  const [displayText, setDisplayText] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Detect prefers-reduced-motion client-side only (avoids hydration mismatch)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayText(GREETINGS[0]);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const currentWord = GREETINGS[greetingIndex];

    if (phase === "typing") {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, TYPEWRITER_SPEED);
      } else {
        timeout = setTimeout(() => setPhase("holding"), PAUSE_AFTER_TYPE);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("erasing"), 100);
    } else if (phase === "erasing") {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText((prev) => prev.slice(0, -1));
        }, ERASE_SPEED);
      } else {
        timeout = setTimeout(() => {
          const nextIndex = (greetingIndex + 1) % GREETINGS.length;
          setGreetingIndex(nextIndex);
          setPhase("typing");
          onLanguageChange(); // 🌸 trigger petal burst
        }, PAUSE_AFTER_ERASE);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, phase, greetingIndex, onLanguageChange, prefersReduced]);

  const isSakura = theme === "sakura";

  return (
    <span
      className={`
        text-[clamp(1.8rem,5vw,3.5rem)] font-bold tracking-wider
        ${isSakura
          ? "font-serif text-[#D13030]"
          : "font-mono text-[var(--accent-primary)] text-glow-cyan"
        }
      `}
      style={
        !isSakura
          ? { textShadow: "0 0 20px #00FFFF, 0 0 45px rgba(0,255,255,0.35)" }
          : {}
      }
    >
      {displayText}
      {/* Blinking cursor */}
      <motion.span
        className={`inline-block ml-0.5 ${isSakura ? "text-[#D13030]" : "text-[var(--accent-primary)]"}`}
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
      >
        |
      </motion.span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NeonGlitchTitle  (night mode only)
───────────────────────────────────────────────────────────────────────────── */

function NeonGlitchTitle() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    let offTimer: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setGlitch(true);
      offTimer = setTimeout(() => setGlitch(false), 160);
    }, 4000);
    // Clear both the interval AND any pending off-timer on unmount
    return () => { clearInterval(id); clearTimeout(offTimer); };
  }, []);

  return (
    <div className="relative flex flex-col items-center text-center w-full">
      {/* Scan line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-[var(--accent-primary)]/25"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

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

      {/* Chromatic aberration ghost */}
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

      <p className="relative z-20 mt-3 text-xs sm:text-sm font-mono text-[var(--text-secondary)] opacity-70 tracking-widest">
        &gt; INIT_PROTOCOL: TRUE
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────────────────────────────────────── */

export function HeroSection() {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [burstCount, setBurstCount] = useState(0);

  // Scroll-driven opacity for the whole hero (fades out as it exits)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });
  const y       = useTransform(smoothProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(smoothProgress, [0, 0.75], [1, 0]);
  // NOTE: gatewayOpacity removed — the section-level opacity already fades all
  // children on scroll. Passing scroll MotionValues as style props inside SSR-rendered
  // elements causes hydration mismatches (string "1" vs number 0).

  const handleLanguageChange = useCallback(() => {
    setBurstCount((c) => c + 1);
  }, []);

  const isSakura = theme === "sakura";

  return (
    <motion.section
      id="home"
      ref={ref}
      style={{ opacity }}
      suppressHydrationWarning
      className="relative flex items-center justify-center h-screen w-full overflow-hidden"
    >
      {/* ── Gateway Drawing Animation ──
          key={theme} forces a full remount when theme changes, so neon circuit
          paths don't bleed into sakura mode and vice-versa. */}
      {/* Gateway — fades in on mount; fades out with the hero section's own scroll opacity */}
      <motion.div
        key={theme}
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GatewayAnimation />
      </motion.div>

      {/* Content wrapper with parallax */}
      <motion.div
        style={{ y }}
        suppressHydrationWarning
        className="relative z-10 flex flex-col items-center px-6 w-full"
      >
        <AnimatePresence mode="wait">
          {isSakura ? (
            /* ── DAY / SAKURA ── */
            <motion.div
              key="sakura"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full max-w-3xl"
            >
              {/*
                ┌─ Greeting row ──────────────────────────────────────────────┐
                │ This div is the ORIGIN POINT for the petal burst.           │
                │ PetalBurst uses absolute positioning relative to this div,  │
                │ so petals emerge from the center of the greeting text.      │
                │ Hero section overflow-hidden clips them within the viewport.│
                └─────────────────────────────────────────────────────────────┘
              */}
              <div className="relative flex items-center justify-center h-16 sm:h-20 mb-2">
                <TypewriterGreeting onLanguageChange={handleLanguageChange} />
                {/* Burst layer — origin point for petals, clipped by hero overflow-hidden */}
                <div className="absolute inset-0 pointer-events-none">
                  <PetalBurst bust={burstCount} />
                </div>
              </div>

              {/* Main title */}
              <h1
                className="font-serif text-[var(--text-primary)] tracking-tight mb-4 leading-tight
                  text-[clamp(2rem,7vw,6rem)]"
              >
                Ingeniero en Sistemas
              </h1>

              {/* Tagline */}
              <motion.p
                className="text-[clamp(0.9rem,2.2vw,1.35rem)] text-[#D13030] font-light italic font-serif"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Código con propósito. Diseño con alma.
              </motion.p>
            </motion.div>
          ) : (
            /* ── NIGHT / NEON ── */
            <motion.div
              key="neon"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="text-center w-full max-w-5xl"
            >
              {/* Greeting row — petal/particle burst origin */}
              <div className="relative flex items-center justify-center h-16 sm:h-20 mb-2">
                <TypewriterGreeting onLanguageChange={handleLanguageChange} />
                <div className="absolute inset-0 pointer-events-none">
                  <PetalBurst bust={burstCount} />
                </div>
              </div>

              <NeonGlitchTitle />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <span
          className={`text-[10px] sm:text-xs mb-2 uppercase tracking-widest
            ${isSakura ? "font-serif text-[var(--text-secondary)]" : "font-mono text-[var(--accent-primary)]"}`}
        >
          {isSakura ? "Descubrir" : "SCROLL_DOWN"}
        </span>
        <div
          className={`w-px h-10 sm:h-12 ${isSakura ? "bg-[var(--text-secondary)]" : "bg-[var(--accent-primary)]"}`}
          style={theme === "neon" ? { boxShadow: "0 0 6px var(--accent-primary)" } : {}}
        />
      </motion.div>
    </motion.section>
  );
}
