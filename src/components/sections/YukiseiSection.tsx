"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useAi } from "@/components/providers/AiProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";


/* ─────────────────────────────────────────────────────────────────────────────
   PHOTO SWITCHER — day / night cards side by side
───────────────────────────────────────────────────────────────────────────── */
type Mode = "day" | "night";

function PhotoSwitcher({
  isNight,
  onSelect,
}: {
  isNight: boolean;
  onSelect: (mode: Mode) => void;
}) {
  const [hovered, setHovered] = useState<Mode | null>(null);

  const cards: { mode: Mode; src: string; label: string; sublabel: string }[] = [
    {
      mode: "day",
      src: "/images/ui/Yukisei2_day.jpg",
      label: "Yukisei · Día",
      sublabel: "Modo Sakura — abre el chat",
    },
    {
      mode: "night",
      src: "/images/ui/Yukisei2_night.jpg",
      label: "Yukisei · Noche",
      sublabel: "Modo Neon — cambia tema + chat",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-4 items-end">
        {cards.map((card, i) => {
          const isHov = hovered === card.mode;
          const isActive = (card.mode === "day" && !isNight) || (card.mode === "night" && isNight);

          return (
            <motion.button
              key={card.mode}
              onClick={() => onSelect(card.mode)}
              onHoverStart={() => setHovered(card.mode)}
              onHoverEnd={() => setHovered(null)}
              animate={{
                scale: isHov ? 1.04 : isActive ? 1.0 : 0.95,
                rotate: i === 0 ? (isHov ? -2 : -3) : (isHov ? 2 : 3),
                y: isHov ? -8 : 0,
              }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative flex flex-col rounded-xl overflow-hidden cursor-pointer focus:outline-none"
              style={{
                width: "clamp(140px, 18vw, 200px)",
                // Give the active card a bigger bottom strip
                background: isNight ? "#0d1117" : "#111",
                boxShadow: isActive
                  ? isNight
                    ? "0 0 0 2px var(--accent-primary), 0 20px 48px rgba(0,0,0,0.6)"
                    : "0 0 0 2px #D13030, 0 20px 48px rgba(0,0,0,0.4)"
                  : "0 8px 32px rgba(0,0,0,0.45)",
                padding: "6px 6px 0 6px",
              }}
              aria-label={card.sublabel}
            >
              {/* Photo */}
              <div
                className="relative overflow-hidden rounded-[6px]"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={card.src}
                  alt={card.label}
                  fill
                  className="object-cover object-top"
                  sizes="200px"
                  loading="eager"
                />
                {/* Hover shine sweep */}
                <AnimatePresence>
                  {isHov && (
                    <motion.div
                      key="shine"
                      initial={{ x: "-100%", opacity: 0.6 }}
                      animate={{ x: "200%", opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: "easeIn" }}
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)",
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Active badge */}
                {isActive && (
                  <motion.div
                    layoutId="active-badge"
                    className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
                    style={{
                      background: isNight ? "var(--accent-primary)" : "#D13030",
                      color: isNight ? "#000" : "#fff",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    ACTIVE
                  </motion.div>
                )}
              </div>

              {/* Bottom label strip */}
              <div className="flex items-center justify-center py-2.5 px-2">
                <span
                  className="text-[11px] font-semibold tracking-widest uppercase"
                  style={{
                    color: isActive
                      ? isNight ? "var(--accent-primary)" : "#D13030"
                      : "rgba(255,255,255,0.45)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {card.mode === "day" ? "☀ Sakura" : "⬡ Neon"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* "Ask me" CTA below photos — more breathing room */}
      <motion.div
        className="flex flex-col items-center gap-2 mt-8"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{
            color: isNight ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Selecciona una versión para abrir el chat
        </span>

        {/* Animated blinking cursor */}
        <div className="flex items-center gap-1.5 mt-1">
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="block w-1.5 h-4 rounded-[1px]"
            style={{
              background: isNight ? "var(--accent-primary)" : "#D13030",
            }}
          />
          <span
            className="text-sm font-semibold"
            style={{
              color: isNight ? "var(--accent-primary)" : "#D13030",
              fontFamily: "var(--font-sans)",
            }}
          >
            Ask me anything
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────────────────────── */
export function YukiseiSection() {
  const { theme, setThemeDirectly } = useTheme();
  const { openAi } = useAi();
  const isNight = theme === "neon";

  function handlePhotoSelect(mode: "day" | "night") {
    if (mode === "night" && !isNight) setThemeDirectly("neon");
    if (mode === "day" && isNight) setThemeDirectly("sakura");
    openAi();
  }

  return (
    <section
      id="yukisei"
      className="relative w-full flex flex-col items-center py-24 px-4 overflow-hidden"
    >
      {/* Subtle radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isNight
            ? "radial-gradient(ellipse 70% 55% at 75% 50%, rgba(0,255,255,0.04) 0%, transparent 100%)"
            : "radial-gradient(ellipse 70% 55% at 75% 50%, rgba(209,48,48,0.04) 0%, transparent 100%)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isNight
            ? "radial-gradient(circle, rgba(0,255,255,0.035) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
        }}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-[1100px] mx-auto text-center mb-16 z-10"
      >
        <p
          className={`text-[11px] tracking-[0.35em] uppercase mb-3 ${
            isNight ? "font-mono text-[var(--accent-primary)]" : "font-sans text-[#D13030]"
          }`}
        >
          IA
        </p>

        <h2
          className={`text-4xl md:text-5xl font-bold mb-4 ${
            isNight ? "font-mono" : "font-serif"
          }`}
        >
          <span className={isNight ? "text-white" : "text-[#1A1A1A]"}>Yukisei </span>
          <span className={isNight ? "text-[var(--accent-primary)] italic" : "text-[#D13030] italic"}>
            System
          </span>
        </h2>

        <p
          className={`text-sm italic opacity-50 ${
            isNight ? "font-mono text-[var(--text-primary)]" : "font-serif text-[#1A1A1A]"
          }`}
        >
          Pregunta cualquier cosa sobre mí.
        </p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px w-20 mx-auto mt-5 origin-center"
          style={{
            background: isNight ? "rgba(0,255,255,0.3)" : "rgba(209,48,48,0.3)",
          }}
        />
      </motion.div>

      {/* ── Main two-column layout ── */}
      <div className="w-full max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-20 z-10">

        {/* ════ LEFT — Description + Features ════ */}
        <motion.div
          className="flex-1 flex flex-col gap-8"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Name chip */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-semibold ${
                  isNight ? "font-mono text-white" : "font-sans text-[#1A1A1A]"
                }`}
              >
                AI Assistant
              </span>
              <span
                className={`text-sm italic ${
                  isNight
                    ? "text-[var(--accent-primary)] font-mono"
                    : "text-[#D13030] font-serif"
                }`}
              >
                — Who&apos;s Behind the Code?
              </span>
            </div>
            {/* Thin underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-1 h-px origin-left"
              style={{
                width: 160,
                background: isNight ? "rgba(0,255,255,0.35)" : "rgba(209,48,48,0.35)",
              }}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-4 max-w-[50ch]">
            <p
              style={{
                color: isNight ? "rgba(210,230,240,0.8)" : "rgba(20,20,20,0.75)",
                fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
                fontSize: "clamp(0.88rem, 1.2vw, 1rem)",
                lineHeight: 1.78,
              }}
            >
              <strong
                style={{ color: isNight ? "#fff" : "#111", fontWeight: 700 }}
              >
                Yukisei
              </strong>{" "}
              es una inteligencia artificial diseñada y entrenada específicamente para
              hablar sobre Francisco — sus proyectos, habilidades, trayectoria y forma
              de pensar. No es un chatbot genérico: conoce el contexto real detrás de
              cada línea de código y cada decisión de diseño.
            </p>
            <p
              style={{
                color: isNight ? "rgba(200,220,235,0.58)" : "rgba(20,20,20,0.52)",
                fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
                fontSize: "clamp(0.82rem, 1.05vw, 0.92rem)",
                lineHeight: 1.75,
              }}
            >
              Fue concebida como una extensión del portafolio — una forma de explorar
              de manera conversacional lo que un CV nunca podría capturar: el razonamiento,
              los valores técnicos y la visión detrás del trabajo.
            </p>
          </div>


        </motion.div>

        {/* ════ RIGHT — Photo Switcher ════ */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <PhotoSwitcher isNight={isNight} onSelect={handlePhotoSelect} />
        </motion.div>

      </div>
    </section>
  );
}
