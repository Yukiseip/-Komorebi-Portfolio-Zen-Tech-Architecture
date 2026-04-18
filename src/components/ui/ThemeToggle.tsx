"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

// ── Sounds ────────────────────────────────────────────────────────────────────
// Pure Web Audio API — no Howler dependency needed here.

function playDaySound(ctx: AudioContext) {
  // Bright ascending chime: three short rising tones
  const notes = [523.25, 659.25, 783.99]; // C5 → E5 → G5
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const t    = ctx.currentTime + i * 0.12;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq * 0.5, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.08);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

function playNightSound(ctx: AudioContext) {
  // Dark descending drone: two low tones with fade
  const notes = [220, 146.83]; // A3 → D3
  notes.forEach((freq, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    const t    = ctx.currentTime + i * 0.18;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq * 2, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.2);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const handleToggle = () => {
    if (isAnimating) return;
    
    // Determine what mode we're switching TO
    const nextMode = theme === "sakura" ? "neon" : "sakura";
    
    try {
      const ctx = getCtx();
      if (nextMode === "sakura") playDaySound(ctx);
      else                       playNightSound(ctx);
    } catch (_) {}

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    toggleTheme();
  };

  const isDay = theme === "sakura";

  return (
    <motion.button
      onClick={handleToggle}
      whileTap={{ scale: 0.88 }}
      aria-label="Toggle Theme"
      title={isDay ? "Activar Modo Noche" : "Activar Modo Día"}
      className="fixed top-6 right-6 z-[9999] cursor-pointer"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Outer orbit ring */}
      <motion.div
        className="relative flex items-center justify-center w-14 h-14"
        animate={ isDay
          ? { rotate: [0, 360] }
          : { rotate: [360, 0] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* Animated orbit dots — DAY only */}
        {isDay && (
          <>
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <motion.span
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#D13030]/60"
                style={{
                  top:  `${50 - 44 * Math.cos((deg * Math.PI) / 180)}%`,
                  left: `${50 + 44 * Math.sin((deg * Math.PI) / 180)}%`,
                }}
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
              />
            ))}
          </>
        )}

        {/* Core button circle */}
        <motion.div
          className={`relative z-10 flex flex-col items-center justify-center w-12 h-12 rounded-full border-[3px] select-none overflow-hidden
            ${isDay
              ? "border-[#D13030] bg-[#FFF5F5] text-[#D13030] shadow-[0_0_12px_rgba(209,48,48,0.25)]"
              : "border-[var(--accent-primary)] bg-[var(--bg-secondary)] text-[var(--accent-primary)] shadow-[0_0_20px_var(--accent-primary)]"
            }`}
          animate={isAnimating
            ? { scale: [1, 1.25, 0.9, 1.05, 1] }
            : undefined
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Neon scan line (night only) */}
          {!isDay && (
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-[var(--accent-primary)]/40 pointer-events-none"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, y: isDay ? -10 : 10, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isDay ? 10 : -10, scale: 0.7 }}
              transition={{ duration: 0.25 }}
              className={`flex flex-col items-center justify-center h-full w-full
                ${isDay ? "font-serif text-[11px] leading-tight" : "font-mono text-xl"}`}
            >
              {isDay ? (
                <>
                  <span>日</span>
                  <span>本</span>
                </>
              ) : (
                <span>N</span>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Tooltip label */}
      <motion.span
        className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest whitespace-nowrap pointer-events-none
          ${isDay ? "text-[#D13030] font-serif" : "text-[var(--accent-primary)] font-mono"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
      >
        {isDay ? "MODE: DAY" : "MODE: NIGHT"}
      </motion.span>
    </motion.button>
  );
}
