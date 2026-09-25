"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────────
   POLAROID CARDS DATA
   4 cards: my photo (front/active), anime, hobbies, journey
───────────────────────────────────────────────────────────────────────────── */
const CARDS = [
  {
    id: "me",
    src: "/images/profile/imagen-personal.jpeg",
    label: "I / Me",
  },
  {
    id: "journey",
    src: "/images/ui/travel.jpeg",
    label: "I Journey",
  },
  {
    id: "anime",
    src: "/images/ui/anime.jpg",
    label: "I Enjoy",
    objectPosition: "top",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   POLAROID COLLAGE
───────────────────────────────────────────────────────────────────────────── */
function PolaroidCollage({ isNight }: { isNight: boolean }) {
  const [activeId, setActiveId] = useState("me");
  const [hovered, setHovered] = useState<string | null>(null);

  const activeIdx = Math.max(
    0,
    CARDS.findIndex((c) => c.id === activeId)
  );

  return (
    <div
      className="relative select-none"
      style={{ width: "min(310px, 78vw)", height: "min(420px, 105vw)" }}
    >
      {CARDS.map((card, i) => {
        const isActive = card.id === activeId;
        const isHov = hovered === card.id;

        // Position slots relative to the active card (0 = center, 1 = left, 2 = right)
        const diff = (i - activeIdx + CARDS.length) % CARDS.length;

        let tx = 0;
        let ty = 0;
        let rot = 0;
        let zIndex = 1;

        if (diff === 0) {
          // Center / Main active photo
          tx = 0;
          ty = 0;
          rot = 0;
          zIndex = 10;
        } else if (diff === 1) {
          // Left wing
          tx = -56;
          ty = 16;
          rot = -8;
          zIndex = isHov ? 6 : 3;
        } else {
          // Right wing
          tx = 56;
          ty = 18;
          rot = 10;
          zIndex = isHov ? 6 : 2;
        }

        const sc = isActive ? 1 : isHov ? 1.04 : 0.98;

        return (
          <motion.div
            key={card.id}
            animate={{
              x: tx,
              y: ty,
              rotate: rot,
              scale: sc,
              zIndex,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={() => setActiveId(card.id)}
            onHoverStart={() => setHovered(card.id)}
            onHoverEnd={() => setHovered(null)}
            className="absolute inset-0 cursor-pointer"
            style={{ zIndex }}
          >
            {/* Polaroid frame */}
            <div
              className="w-full h-full flex flex-col rounded-sm overflow-hidden transition-all duration-300"
              style={{
                background: isNight ? "#0b1219" : "#1a1a1a",
                border: isNight
                  ? isActive
                    ? "1.5px solid rgba(0, 255, 255, 0.9)"
                    : "1.5px solid rgba(0, 255, 255, 0.4)"
                  : "none",
                boxShadow: isActive
                  ? isNight
                    ? "0 0 30px rgba(0,255,255,0.35), 0 20px 60px rgba(0,0,0,0.85)"
                    : "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)"
                  : isNight
                    ? "0 0 16px rgba(0,255,255,0.15), 0 8px 32px rgba(0,0,0,0.6)"
                    : "0 8px 32px rgba(0,0,0,0.5)",
                padding: "8px 8px 0 8px",
              }}
            >
              {/* Photo area */}
              <div
                className="relative flex-1 overflow-hidden rounded-[2px]"
                style={{
                  border: isNight ? "1px solid rgba(0, 255, 255, 0.25)" : "none",
                }}
              >
                <Image
                  src={card.src}
                  alt={card.label}
                  fill
                  className="object-cover"
                  style={{ objectPosition: card.objectPosition || "center" }}
                  sizes="(max-width: 640px) 260px, 310px"
                  quality={82}
                  loading={card.id === "me" ? "eager" : "lazy"}
                />
                {/* Subtle inner vignette */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.35) 100%)",
                  }}
                />
              </div>

              {/* Label strip (bottom of polaroid) */}
              <div
                className="flex items-center justify-center py-3"
                style={{ minHeight: 44 }}
              >
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.span
                      key={card.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm font-semibold tracking-widest uppercase"
                      style={{
                        color: isNight
                          ? "#00FFFF"
                          : "rgba(255,255,255,0.75)",
                        textShadow: isNight ? "0 0 8px rgba(0,255,255,0.5)" : "none",
                        fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
                        letterSpacing: "0.18em",
                      }}
                    >
                      {card.label}
                    </motion.span>
                  )}
                  {!isActive && (
                    <motion.span
                      key={card.id + "-dim"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.35 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] tracking-widest uppercase"
                      style={{
                        color: isNight ? "rgba(0,255,255,0.6)" : "rgba(255,255,255,0.35)",
                        fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
                      }}
                    >
                      {card.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Dot indicators */}
      <div
        className="absolute -bottom-7 left-0 right-0 flex justify-center gap-1.5"
        style={{ zIndex: 20 }}
      >
        {CARDS.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className="rounded-full transition-all"
            style={{
              width: c.id === activeId ? 18 : 6,
              height: 6,
              background:
                c.id === activeId
                  ? isNight
                    ? "var(--accent-primary)"
                    : "#D13030"
                  : isNight
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.18)",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`Ver tarjeta ${c.label}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */
export function AboutMe() {
  const { theme } = useTheme();
  const isNight = theme === "neon";
  const sectionRef = useRef<HTMLElement>(null);

  // Subtle parallax on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 900, damping: 90 });
  const yText = useTransform(smooth, [0, 1], [-16, 16]);
  const yPhoto = useTransform(smooth, [0, 1], [24, -24]);

  return (
    <section
      id="about"
      ref={sectionRef}
      suppressHydrationWarning
      className="relative w-full flex flex-col justify-center min-h-screen py-24 px-4 sm:px-8 overflow-hidden"
    >

      {/* Ambient orb */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          right: "-5%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: isNight
            ? "radial-gradient(circle, rgba(0,255,255,0.05) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,183,197,0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Terminal Command Eyebrow ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        suppressHydrationWarning
        className="w-full max-w-[1200px] mx-auto mb-10 z-10"
      >
        <div className="inline-flex items-center gap-2 font-mono text-sm sm:text-base font-semibold tracking-wider">
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: "linear",
            }}
            className={
              isNight
                ? "text-[var(--accent-primary)] font-bold text-base sm:text-lg select-none"
                : "text-[#D13030] font-bold text-base sm:text-lg select-none"
            }
          >
            &gt;
          </motion.span>
          <span
            className={isNight ? "text-white" : "text-[#1A1A1A]"}
          >
            more_about_me.exe
          </span>
          <span
            className={`text-xs sm:text-sm font-normal ${isNight ? "text-[var(--accent-primary)] opacity-80" : "text-[#D13030] opacity-85"
              }`}
          >
            --whoami --verbose
          </span>
        </div>
        {/* Thin underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-1.5 h-px origin-left"
          style={{
            width: 220,
            background: isNight ? "rgba(0,255,255,0.4)" : "rgba(209,48,48,0.35)",
          }}
        />
      </motion.div>

      {/* ── Main two-column layout ── */}
      <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-20 z-10">

        {/* ════ LEFT — Text ════ */}
        <motion.div
          style={{ y: yText }}
          suppressHydrationWarning
          className="flex-1 flex flex-col justify-center"
        >
          {/* "Hi! there, I'm …" */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="mb-5 leading-tight"
            style={{
              fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              color: isNight ? "#ffffff" : "#111111",
              fontWeight: 700,
            }}
          >
            Hi! there, I&apos;m{" "}
            <span
              style={{
                color: isNight ? "var(--accent-primary)" : "#D13030",
                fontStyle: "italic",
                fontWeight: 800,
              }}
            >
              Francisco Calvo
            </span>
          </motion.h2>

          {/* Paragraphs */}
          <div className="flex flex-col gap-4 max-w-[52ch]">
            {[
              "Soy ingeniero en sistemas enfocado en el desarrollo de software, análisis de datos e inteligencia artificial. Disfruto diseñar y construir soluciones web, automatizar procesos y explorar nuevas tecnologías para resolver problemas de forma práctica y eficiente.",
              "Mi experiencia comenzó con el desarrollo frontend y backend de aplicaciones web y, con el tiempo, evolucionó hacia áreas como inteligencia artificial, procesamiento y análisis de datos, automatización y ciberseguridad. Actualmente, continúo desarrollando proyectos que integran estas tecnologías para crear soluciones modernas y funcionales.",
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  color: isNight ? "rgba(210,225,240,0.72)" : "rgba(30,30,30,0.68)",
                  fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
                  fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
                  lineHeight: 1.75,
                }}
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Skill tags */}
          <motion.div
            className="flex flex-wrap gap-x-6 gap-y-2 mt-7"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {["Full-Stack Dev", "IA / ML", "Big Data", "Ciberseguridad", "UX / UI"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold uppercase tracking-widest py-1"
                style={{
                  fontFamily: isNight ? "var(--font-mono)" : "var(--font-sans)",
                  color: isNight ? "rgba(0,255,255,0.8)" : "rgba(209,48,48,0.9)",
                  background: "transparent",
                  border: "none",
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ════ RIGHT — Polaroid Collage ════ */}
        <motion.div
          style={{ y: yPhoto }}
          suppressHydrationWarning
          className="flex-shrink-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <PolaroidCollage isNight={isNight} />
        </motion.div>

      </div>
    </section>
  );
}
