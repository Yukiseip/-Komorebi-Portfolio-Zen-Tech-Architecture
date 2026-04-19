"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   SectionDivider
   A themed, animated horizontal divider that separates page sections.
   Renders a centered line + ornament adapted to the active theme.
───────────────────────────────────────────────────────────────────────────── */
export function SectionDivider() {
  const { theme } = useTheme();
  const isNight = theme === "neon";

  const lineColorNight = "linear-gradient(to right, transparent, rgba(0,255,255,0.35))";
  const lineColorDay   = "linear-gradient(to right, transparent, rgba(209,48,48,0.25))";

  return (
    <div
      aria-hidden
      className="relative w-full flex items-center justify-center py-2 px-8 overflow-hidden"
    >
      {/* Left arm — grows from right to left */}
      <motion.div
        className="flex-1 h-px max-w-[480px]"
        style={{
          background: isNight ? lineColorNight : lineColorDay,
          transformOrigin: "right",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, amount: 0.5 }}
      />

      {/* Centre ornament */}
      <motion.div
        className="mx-4 shrink-0 flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, amount: 0.5 }}
      >
        {isNight ? (
          /* Neon theme: three cyan dots with glow */
          <>
            <span
              className="block w-1 h-1 rounded-full bg-[var(--accent-primary)]"
              style={{ boxShadow: "0 0 6px #00FFFF, 0 0 12px rgba(0,255,255,0.5)" }}
            />
            <span
              className="block w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]"
              style={{ boxShadow: "0 0 8px #00FFFF, 0 0 18px rgba(0,255,255,0.6)" }}
            />
            <span
              className="block w-1 h-1 rounded-full bg-[var(--accent-primary)]"
              style={{ boxShadow: "0 0 6px #00FFFF, 0 0 12px rgba(0,255,255,0.5)" }}
            />
          </>
        ) : (
          /* Sakura theme: small 5-petal flower */
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ opacity: 0.65 }}
          >
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <ellipse
                key={i}
                cx="12"
                cy="6"
                rx="2.2"
                ry="4.5"
                fill="#D13030"
                transform={`rotate(${deg} 12 12)`}
                opacity="0.78"
              />
            ))}
            <circle cx="12" cy="12" r="2" fill="#D13030" />
          </svg>
        )}
      </motion.div>

      {/* Right arm — grows from left to right */}
      <motion.div
        className="flex-1 h-px max-w-[480px]"
        style={{
          background: isNight
            ? "linear-gradient(to left, transparent, rgba(0,255,255,0.35))"
            : "linear-gradient(to left, transparent, rgba(209,48,48,0.25))",
          transformOrigin: "left",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: false, amount: 0.5 }}
      />
    </div>
  );
}
