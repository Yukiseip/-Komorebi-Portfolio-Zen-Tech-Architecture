"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

// ── Petal config type ────────────────────────────────────────────────────────
interface LoadingPetal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  rotate: number;
}

// Sakura petal SVG path
function SakuraPetal({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 C14 6, 20 8, 20 12 C20 16, 16 20, 12 22 C8 20, 4 16, 4 12 C4 8, 10 6, 12 2Z"
        fill={color}
        opacity="0.85"
      />
    </svg>
  );
}

// Torii gate for neon loading
function NeonTorii() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mb-6">
      {/* Left pillar */}
      <motion.line
        x1="25" y1="95" x2="25" y2="30"
        stroke="#00FFFF" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{ filter: "drop-shadow(0 0 6px #00FFFF)" }}
      />
      {/* Right pillar */}
      <motion.line
        x1="95" y1="95" x2="95" y2="30"
        stroke="#00FFFF" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ filter: "drop-shadow(0 0 6px #00FFFF)" }}
      />
      {/* Lower beam */}
      <motion.path
        d="M18 55 Q60 48 102 55"
        stroke="#00FFFF" strokeWidth="4" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{ filter: "drop-shadow(0 0 8px #00FFFF)" }}
      />
      {/* Upper beam (curved kasagi) */}
      <motion.path
        d="M8 38 Q60 28 112 38"
        stroke="#FF00FF" strokeWidth="4" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ filter: "drop-shadow(0 0 8px #FF00FF)" }}
      />
      {/* Upper beam ends curving up */}
      <motion.path
        d="M8 38 L2 30 M112 38 L118 30"
        stroke="#FF00FF" strokeWidth="3" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
        style={{ filter: "drop-shadow(0 0 6px #FF00FF)" }}
      />
    </svg>
  );
}

// Sakura branch for day loading
function SakuraBranch() {
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none" className="mb-6">
      {/* Main branch */}
      <motion.path
        d="M20 100 Q60 70 100 50 Q130 35 145 20"
        stroke="#8B1A1A" strokeWidth="2.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      {/* Sub-branch 1 */}
      <motion.path
        d="M60 72 Q55 55 48 42"
        stroke="#8B1A1A" strokeWidth="1.8" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
      />
      {/* Sub-branch 2 */}
      <motion.path
        d="M95 53 Q105 38 100 22"
        stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
      />
      {/* Blossoms */}
      {[
        { cx: 50, cy: 42, r: 7, delay: 1.2 },
        { cx: 100, cy: 22, r: 6, delay: 1.4 },
        { cx: 145, cy: 20, r: 8, delay: 1.1 },
        { cx: 115, cy: 38, r: 5, delay: 1.5 },
        { cx: 75, cy: 60, r: 6, delay: 1.3 },
      ].map((blossom, i) => (
        <motion.circle
          key={i}
          cx={blossom.cx}
          cy={blossom.cy}
          r={blossom.r}
          fill="#FFB7C5"
          opacity="0.9"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.4, delay: blossom.delay, type: "spring", stiffness: 400 }}
          style={{ transformOrigin: `${blossom.cx}px ${blossom.cy}px` }}
        />
      ))}
    </svg>
  );
}

// Loading dots
const DOTS = [0, 1, 2];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"intro" | "loading" | "exit">("intro");
  const isSakura = theme === "sakura";

  // Generated client-side only (AppShell prevents SSR of this component).
  // useMemo keeps values stable across re-renders without triggering a mismatch.
  const loadingPetals = useMemo<LoadingPetal[]>(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 4,
        size: 8 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 80,
        rotate: Math.random() * 360,
      })),
    [] // computed once per mount
  );

  useEffect(() => {
    // Phase 1: intro animation (0.8s)
    const introTimer = setTimeout(() => setPhase("loading"), 800);

    // Phase 2: progress bar
    let pct = 0;
    const tick = setInterval(() => {
      pct += Math.random() * 12 + 5;
      if (pct >= 100) {
        pct = 100;
        clearInterval(tick);
        setTimeout(() => {
          setPhase("exit");
          setTimeout(onComplete, 700);
        }, 400);
      }
      setProgress(Math.min(pct, 100));
    }, 120);

    return () => {
      clearTimeout(introTimer);
      clearInterval(tick);
    };
  }, [onComplete]);

  const bgStyle = isSakura
    ? { background: "linear-gradient(135deg, #FFF5F7 0%, #FFE4EC 50%, #FFF0F5 100%)" }
    : { background: "linear-gradient(135deg, #030308 0%, #050515 50%, #020210 100%)" };

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={bgStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Ambient petals / particles background */}
          {loadingPetals.map((petal) =>
            isSakura ? (
              <motion.div
                key={petal.id}
                className="absolute pointer-events-none"
                style={{ left: `${petal.x}%`, top: "-5%" }}
                animate={{
                  y: ["0vh", "110vh"],
                  x: [0, petal.drift],
                  rotate: [petal.rotate, petal.rotate + 180],
                  opacity: [0, 0.7, 0.7, 0],
                }}
                transition={{
                  duration: petal.duration,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <SakuraPetal size={petal.size} color="#FFB7C5" />
              </motion.div>
            ) : (
              <motion.div
                key={petal.id}
                className="absolute pointer-events-none rounded-full"
                style={{
                  left: `${petal.x}%`,
                  top: "-5%",
                  width: petal.size * 0.4,
                  height: petal.size * 0.4,
                  background: petal.id % 2 === 0 ? "#00FFFF" : "#FF00FF",
                  boxShadow: `0 0 ${petal.size}px ${petal.id % 2 === 0 ? "#00FFFF" : "#FF00FF"}`,
                }}
                animate={{
                  y: ["0vh", "110vh"],
                  x: [0, petal.drift * 0.5],
                  opacity: [0, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: petal.duration * 1.2,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            )
          )}

          {/* Central content */}
          <motion.div
            className="flex flex-col items-center z-10 px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Icon: branch or torii */}
            {isSakura ? <SakuraBranch /> : <NeonTorii />}

            {/* Main text */}
            <motion.div className="text-center mb-8">
              {isSakura ? (
                <>
                  <motion.p
                    className="font-mono text-xs tracking-[0.4em] text-[#8B1A1A]/60 mb-2 uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ようこそ
                  </motion.p>
                  <motion.h1
                    className="font-serif text-4xl text-[#1A1A1A] tracking-tight"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    桜が咲く
                  </motion.h1>
                  <motion.p
                    className="font-serif text-sm text-[#4A4A4A]/70 mt-2 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    Preparando la experiencia…
                  </motion.p>
                </>
              ) : (
                <>
                  <motion.p
                    className="font-mono text-xs tracking-[0.4em] text-[#00FFFF]/50 mb-2 uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ textShadow: "0 0 10px #00FFFF" }}
                  >
                    SYSTEM_BOOT
                  </motion.p>
                  <motion.h1
                    className="font-mono text-4xl font-black tracking-widest text-[#00FFFF] uppercase"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    style={{ textShadow: "0 0 20px #00FFFF, 0 0 40px rgba(0,255,255,0.4)" }}
                  >
                    BUILDING
                  </motion.h1>
                  <motion.p
                    className="font-mono text-xs text-[#A0A0A0] mt-2 tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    &gt; INIT_PROTOCOL: TRUE
                  </motion.p>
                </>
              )}
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-64 sm:w-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div
                className="h-[2px] w-full rounded-full overflow-hidden mb-3"
                style={{ background: isSakura ? "rgba(209,48,48,0.15)" : "rgba(0,255,255,0.15)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: isSakura
                      ? "linear-gradient(90deg, #FFB7C5, #D13030)"
                      : "linear-gradient(90deg, #00FFFF, #FF00FF)",
                    boxShadow: isSakura
                      ? "0 0 8px rgba(209,48,48,0.5)"
                      : "0 0 10px #00FFFF, 0 0 20px rgba(0,255,255,0.3)",
                    width: `${progress}%`,
                  }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                />
              </div>

              {/* Loading dots or percentage */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {DOTS.map((d) => (
                    <motion.div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: isSakura ? "#D13030" : "#00FFFF" }}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: d * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <motion.span
                  className="font-mono text-xs"
                  style={{ color: isSakura ? "#8B1A1A" : "#00FFFF", opacity: 0.7 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom kanji/signature */}
          <motion.div
            className="absolute bottom-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
          >
            <p
              className="font-serif text-xs tracking-widest"
              style={{ color: isSakura ? "#8B1A1A" : "#A0A0A0" }}
            >
              {isSakura ? "🌸 Komorebi · 木漏れ日" : "// KOMOREBI_NEON_v2.0"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
