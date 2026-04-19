"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

/* ─────────────────────────────────────────────────────────────────────────────
   PetalBurst
   A burst of 10-15 petals that emanates from behind the greeting title.
   Triggered externally via the `burst` prop (increments each time a new
   language is displayed). Petals are strictly clipped within the hero boundary.
───────────────────────────────────────────────────────────────────────────── */

interface Petal {
  id: number;
  x: number; // % from center (–50 to 50)
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotate: number;
  duration: number;
  delay: number;
  color: string;
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const SAKURA_COLORS = ["#FFB7C5", "#FFD1DC", "#FFC8D4", "#E89EAD", "#FFE4EC"];
const NEON_COLORS   = ["#00FFFF", "#FF00FF", "#7B2FFF", "#00E5FF", "#FF6EC7"];

function makePetals(theme: string): Petal[] {
  const count = Math.floor(randomBetween(10, 16));
  const colors = theme === "sakura" ? SAKURA_COLORS : NEON_COLORS;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(-60, 60),
    y: randomBetween(-20, 20),
    vx: randomBetween(-120, 120),
    vy: randomBetween(-80, 40),
    size: randomBetween(8, 18),
    rotate: randomBetween(0, 360),
    duration: randomBetween(1.2, 2.5),
    delay: randomBetween(0, 0.3),
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

interface PetalBurstProps {
  bust: number; // increment to trigger a new burst
}

export function PetalBurst({ bust }: PetalBurstProps) {
  const { theme } = useTheme();
  const [petals, setPetals] = useState<Petal[]>([]);
  const burstKeyRef = useRef(0);

  useEffect(() => {
    if (bust === 0) return; // skip on mount
    burstKeyRef.current += 1;
    setPetals(makePetals(theme));
    const t = setTimeout(() => setPetals([]), 2800);
    return () => clearTimeout(t);
  }, [bust, theme]);

  const isSakura = theme === "sakura";

  return (
    /* Strictly clipped to hero boundary via overflow-hidden on the parent.
       This div sits at the center of the greeting text, using absolute
       positioning with translate-center. */
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      <AnimatePresence>
        {petals.map((p) => (
          <motion.div
            key={`${burstKeyRef.current}-${p.id}`}
            className="absolute"
            /* Start position: center of the div */
            style={{
              left: "50%",
              top: "50%",
              width: p.size,
              height: p.size,
            }}
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0,
              rotate: p.rotate,
            }}
            animate={{
              x: p.vx,
              y: p.vy,
              scale: [0, 1.2, 1, 0.8],
              opacity: [0, 1, 1, 0],
              rotate: p.rotate + 360,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {isSakura ? (
              /* Petal shape */
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2 C14 6, 20 8, 20 12 C20 16, 16 20, 12 22 C8 20, 4 16, 4 12 C4 8, 10 6, 12 2Z"
                  fill={p.color}
                  opacity="0.9"
                />
              </svg>
            ) : (
              /* Neon particle */
              <div
                style={{
                  width: p.size * 0.5,
                  height: p.size * 0.5,
                  borderRadius: "50%",
                  background: p.color,
                  boxShadow: `0 0 ${p.size}px ${p.color}, 0 0 ${p.size * 2}px ${p.color}40`,
                }}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SettledPetals
   A static row of petals "resting" on the top edge of the About section.
   Fades in once the Hero fully exits. Only renders in sakura mode.
   In neon mode, renders a thin glowing data separator line.
───────────────────────────────────────────────────────────────────────────── */

const SETTLED_POSITIONS = [
  { x: "3%",  rot: -12, size: 10, opacity: 0.6 },
  { x: "8%",  rot:  5,  size: 14, opacity: 0.8 },
  { x: "14%", rot: -8,  size: 11, opacity: 0.7 },
  { x: "20%", rot: 15,  size: 9,  opacity: 0.5 },
  { x: "28%", rot: -3,  size: 13, opacity: 0.75 },
  { x: "35%", rot: 20,  size: 8,  opacity: 0.6 },
  { x: "42%", rot: -15, size: 12, opacity: 0.8 },
  { x: "50%", rot: 8,   size: 10, opacity: 0.65 },
  { x: "57%", rot: -20, size: 14, opacity: 0.7 },
  { x: "64%", rot: 5,   size: 9,  opacity: 0.55 },
  { x: "71%", rot: -10, size: 13, opacity: 0.8 },
  { x: "78%", rot: 18,  size: 10, opacity: 0.6 },
  { x: "84%", rot: -5,  size: 12, opacity: 0.75 },
  { x: "91%", rot: 12,  size: 9,  opacity: 0.65 },
  { x: "96%", rot: -8,  size: 11, opacity: 0.7 },
];

interface SettledPetalsProps {
  visible: boolean;
}

export function SettledPetals({ visible }: SettledPetalsProps) {
  const { theme } = useTheme();
  const isSakura = theme === "sakura";

  return (
    <div
      className="absolute top-0 left-0 right-0 h-16 pointer-events-none overflow-hidden z-10"
      aria-hidden
    >
      <AnimatePresence>
        {visible && (
          <>
            {isSakura ? (
              SETTLED_POSITIONS.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: p.x,
                    top: -p.size / 3,
                    rotate: p.rot,
                  }}
                  initial={{ y: -30, opacity: 0, scale: 0.5 }}
                  animate={{ y: 0, opacity: p.opacity, scale: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{
                    delay: i * 0.04,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                >
                  <svg
                    width={p.size}
                    height={p.size}
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2 C14 6, 20 8, 20 12 C20 16, 16 20, 12 22 C8 20, 4 16, 4 12 C4 8, 10 6, 12 2Z"
                      fill="#FFB7C5"
                    />
                  </svg>
                </motion.div>
              ))
            ) : (
              /* Neon: glowing separator line */
              <motion.div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, #00FFFF 20%, #FF00FF 50%, #00FFFF 80%, transparent 100%)",
                  boxShadow: "0 0 12px #00FFFF, 0 0 24px rgba(0,255,255,0.3)",
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
