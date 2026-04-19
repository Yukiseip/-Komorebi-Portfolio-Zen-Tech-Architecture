"use client";

import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";

/**
 * GatewayAnimation — dual-theme SVG drawn on load.
 *
 * Sakura mode:  light-pink Torii gate silhouette drawn in thin strokes.
 * Neon mode:    cyan/magenta digital circuit lines framing the text.
 *
 * Uses stroke-dashoffset to give a "drawing with light" effect.
 */
export function GatewayAnimation() {
  const { theme } = useTheme();
  const isSakura = theme === "sakura";

  const strokeColor  = isSakura ? "#FFB7C5" : "#00FFFF";
  const accentColor  = isSakura ? "#E89EAD" : "#FF00FF";
  const strokeWidth  = isSakura ? 1.5 : 1.2;
  const glow         = isSakura
    ? "drop-shadow(0 0 4px rgba(255,183,197,0.6))"
    : "drop-shadow(0 0 6px #00FFFF)";
  const accentGlow   = isSakura
    ? "drop-shadow(0 0 3px rgba(232,158,173,0.5))"
    : "drop-shadow(0 0 8px #FF00FF)";

  // Draw timing — returns typed props for motion SVG path/line/rect
  const draw = (delay: number, duration = 1.4) => ({
    initial:    { pathLength: 0, opacity: 0 } as const,
    animate:    { pathLength: 1, opacity: 1 } as const,
    transition: { duration, delay, ease: "easeOut" } as Transition,
  });

  return (
    <svg
      viewBox="0 0 520 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
      style={{ opacity: 0.75 }}
    >
      {/* ───────── SHARED: outer decorative border ───────── */}
      <motion.rect
        x="10" y="10" width="500" height="320" rx="4"
        stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill="none"
        {...draw(0.0, 2.0)}
        style={{ filter: glow }}
      />

      {/* ───────── TORII GATE (sakura) / CIRCUIT ARCH (neon) ───────── */}

      {isSakura ? (
        <>
          {/* Torii: left pillar */}
          <motion.line
            x1="155" y1="310" x2="155" y2="140"
            stroke={strokeColor} strokeWidth={strokeWidth * 1.8} strokeLinecap="round"
            {...draw(0.3, 1.0)} style={{ filter: glow }}
          />
          {/* Torii: right pillar */}
          <motion.line
            x1="365" y1="310" x2="365" y2="140"
            stroke={strokeColor} strokeWidth={strokeWidth * 1.8} strokeLinecap="round"
            {...draw(0.4, 1.0)} style={{ filter: glow }}
          />
          {/* Torii: lower crossbeam (nuki) */}
          <motion.path
            d="M130 180 Q260 164 390 180"
            stroke={strokeColor} strokeWidth={strokeWidth * 2.5} strokeLinecap="round" fill="none"
            {...draw(0.8, 0.9)} style={{ filter: glow }}
          />
          {/* Torii: upper beam (kasagi) — curved */}
          <motion.path
            d="M105 148 Q260 130 415 148"
            stroke={accentColor} strokeWidth={strokeWidth * 2.8} strokeLinecap="round" fill="none"
            {...draw(1.1, 1.0)} style={{ filter: accentGlow }}
          />
          {/* Kasagi end-curls */}
          <motion.path
            d="M105 148 L90 140 M415 148 L430 140"
            stroke={accentColor} strokeWidth={strokeWidth * 1.5} strokeLinecap="round" fill="none"
            {...draw(1.9, 0.5)} style={{ filter: accentGlow }}
          />
          {/* Shimagi (top ridge) */}
          <motion.path
            d="M120 134 Q260 118 400 134"
            stroke={accentColor} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"
            {...draw(2.0, 0.7)} style={{ filter: accentGlow }}
          />
          {/* Sub-pillar (kouhai) small lower cross */}
          <motion.line
            x1="140" y1="240" x2="380" y2="240"
            stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round"
            {...draw(2.2, 0.6)} style={{ filter: glow }}
          />
          {/* Hanging shimenawa rope dots */}
          {[170, 195, 220, 245, 270, 295, 320, 345].map((cx, i) => (
            <motion.circle
              key={i}
              cx={cx} cy={193} r={2.5}
              fill={accentColor}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ delay: 2.5 + i * 0.07, duration: 0.3 }}
              style={{ filter: accentGlow }}
            />
          ))}
          {/* Corner branch decoration — top left */}
          <motion.path
            d="M10 10 Q50 30, 40 60 M40 60 Q55 45, 70 50 M40 60 Q38 75, 30 85"
            stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"
            {...draw(2.6, 0.8)} style={{ filter: glow }}
          />
          {/* Mini blossoms at branch tips */}
          {[[70, 50], [30, 85]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={4}
              fill="#FFD1DC"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ delay: 3.2 + i * 0.15, type: "spring", stiffness: 500 }}
            />
          ))}
          {/* Corner branch decoration — top right */}
          <motion.path
            d="M510 10 Q470 30, 480 60 M480 60 Q465 45, 450 50 M480 60 Q482 75, 490 85"
            stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"
            {...draw(2.8, 0.8)} style={{ filter: glow }}
          />
          {[[450, 50], [490, 85]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={4}
              fill="#FFD1DC"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ delay: 3.4 + i * 0.15, type: "spring", stiffness: 500 }}
            />
          ))}
        </>
      ) : (
        <>
          {/* NEON: Circuit-board framing arch */}
          {/* Left vertical rail */}
          <motion.path
            d="M120 320 L120 200 L100 180 L100 100"
            stroke={strokeColor} strokeWidth={strokeWidth * 1.5} strokeLinecap="square"
            {...draw(0.2, 1.0)} style={{ filter: glow }}
          />
          {/* Right vertical rail */}
          <motion.path
            d="M400 320 L400 200 L420 180 L420 100"
            stroke={strokeColor} strokeWidth={strokeWidth * 1.5} strokeLinecap="square"
            {...draw(0.3, 1.0)} style={{ filter: glow }}
          />
          {/* Top left circuit to center top */}
          <motion.path
            d="M100 100 L100 70 L180 70 L200 50"
            stroke={strokeColor} strokeWidth={strokeWidth * 1.5} strokeLinecap="square"
            {...draw(1.0, 0.8)} style={{ filter: glow }}
          />
          {/* Top right circuit to center top */}
          <motion.path
            d="M420 100 L420 70 L340 70 L320 50"
            stroke={strokeColor} strokeWidth={strokeWidth * 1.5} strokeLinecap="square"
            {...draw(1.1, 0.8)} style={{ filter: glow }}
          />
          {/* Center top arch */}
          <motion.path
            d="M200 50 Q260 36 320 50"
            stroke={accentColor} strokeWidth={strokeWidth * 2} strokeLinecap="round" fill="none"
            {...draw(1.7, 0.7)} style={{ filter: accentGlow }}
          />
          {/* Circuit dots (nodes) */}
          {[
            [120, 200], [400, 200], [100, 100], [420, 100], [200, 50], [320, 50],
          ].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r={4}
              fill={i % 2 === 0 ? strokeColor : accentColor}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.0 + i * 0.12, duration: 0.3, type: "spring" }}
              style={{ filter: i % 2 === 0 ? glow : accentGlow }}
            />
          ))}
          {/* Bottom circuit traces */}
          <motion.path
            d="M120 280 L80 280 L80 330"
            stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="square"
            {...draw(2.0, 0.5)} style={{ filter: glow }}
          />
          <motion.path
            d="M400 280 L440 280 L440 330"
            stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="square"
            {...draw(2.1, 0.5)} style={{ filter: glow }}
          />
          {/* Scan-line pulse */}
          <motion.line
            x1="120" y1="0" x2="400" y2="0"
            stroke={accentColor} strokeWidth={strokeWidth * 0.8}
            animate={{ y: [60, 320, 60], opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2 }}
            style={{ filter: accentGlow }}
          />
        </>
      )}
    </svg>
  );
}
