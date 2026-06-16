"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
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
    rotate: 0,
    offsetX: 0,
    offsetY: 0,
    zBase: 3,
  },
  {
    id: "journey",
    src: "/images/ui/travel.jpeg",
    label: "I Journey",
    rotate: -8,
    offsetX: -55,
    offsetY: 15,
    zBase: 2,
  },
  {
    id: "anime",
    src: "/images/ui/anime.jpg",
    label: "I Enjoy",
    rotate: 10,
    offsetX: 55,
    offsetY: 18,
    zBase: 1,
    objectPosition: "top",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   POLAROID COLLAGE
───────────────────────────────────────────────────────────────────────────── */
function PolaroidCollage({ isNight }: { isNight: boolean }) {
  const [activeId, setActiveId] = useState("me");
  const [hovered, setHovered] = useState<string | null>(null);

  // Cycle active card every 8 s
  useEffect(() => {
    const ids = CARDS.map((c) => c.id);
    const t = setInterval(() => {
      setActiveId((prev) => {
        const i = ids.indexOf(prev);
        return ids[(i + 1) % ids.length];
      });
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative select-none"
      style={{ width: 310, height: 420 }}
    >
      {CARDS.map((card) => {
        const isActive = card.id === activeId;
        const isHov = hovered === card.id;

        // Active card comes fully to the front, others keep base z
        const zIndex = isActive ? 10 : card.zBase;

        // When a card is active: center it. Otherwise stack behind with offsets.
        const tx = isActive ? 0 : card.offsetX;
        const ty = isActive ? 0 : card.offsetY;
        const rot = isActive ? 0 : card.rotate;
        const sc = isHov && !isActive ? 1.04 : 1;

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
              className="w-full h-full flex flex-col rounded-sm overflow-hidden"
              style={{
                background: isNight ? "#111417" : "#1a1a1a",
                boxShadow: isActive
                  ? isNight
                    ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,255,0.12)"
                    : "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.12)"
                  : "0 8px 32px rgba(0,0,0,0.5)",
                padding: "8px 8px 0 8px",
              }}
            >
              {/* Photo area */}
              <div className="relative flex-1 overflow-hidden rounded-[2px]">
                <Image
                  src={card.src}
                  alt={card.label}
                  fill
                  className="object-cover"
                  style={{ objectPosition: card.objectPosition || "center" }}
                  sizes="310px"
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
                          ? "rgba(255,255,255,0.82)"
                          : "rgba(255,255,255,0.75)",
                        fontFamily: "var(--font-sans)",
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
                        color: "rgba(255,255,255,0.35)",
                        fontFamily: "var(--font-sans)",
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

      {/* ── Top eyebrow ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-[1200px] mx-auto mb-10 z-10"
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              isNight ? "font-mono text-white" : "font-sans text-[#1A1A1A]"
            }`}
          >
            More About me
          </span>
          <span
            className={`text-sm italic ${
              isNight
                ? "text-[var(--accent-primary)] font-mono"
                : "text-[#D13030] font-serif"
            }`}
          >
            — Who&apos;s Behind the Terminal?
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
              "Soy un apasionado de la tecnología, el desarrollo de software y la innovación. Disfruto crear proyectos web, aprender nuevas tecnologías y explorar áreas como la Inteligencia Artificial, la Ciberseguridad y los sistemas emergentes que están transformando la manera en que interactuamos con el mundo digital.",
              "Mi trayectoria comenzó explorando tecnologías frontend y backend para construir aplicaciones web modernas y eficientes. Con el tiempo, mi curiosidad me llevó a profundizar en IA, seguridad informática y arquitecturas de datos — campos que considero fundamentales para el futuro tecnológico.",
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

          {/* "Follow My Journey" button */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.5 }}
          >
            <motion.a
              href="#experience"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
              style={{
                background: "transparent",
                border: isNight
                  ? "1px solid rgba(255,255,255,0.35)"
                  : "1px solid rgba(0,0,0,0.3)",
                color: isNight ? "rgba(255,255,255,0.88)" : "rgba(0,0,0,0.75)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.02em",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: isNight ? "var(--accent-primary)" : "#D13030",
                  boxShadow: isNight ? "0 0 6px var(--accent-primary)" : "none",
                }}
              />
              Follow My Journey
            </motion.a>
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
