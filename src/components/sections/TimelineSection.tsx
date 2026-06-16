"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
interface TimelineEntry {
  year: string;
  title: string;
  entity: string;
  description: string;
  image: string;
  tag?: string; // "Experience" | "Education" | "Award"
}

const TIMELINE_DATA: TimelineEntry[] = [
  {
    year: "2026",
    tag: "Experience",
    title: "Auxiliar Administrativo — Datos & IA",
    entity: "Fiscalía General del Estado de Chiapas",
    description:
      "Automatización de procesos internos con Python e IA local (LLMs on-premise). Desarrollo de dashboards analíticos en Streamlit y sistemas de consulta inteligente basados en RAG, reduciendo tiempos de búsqueda documental en un 70%.",
    image: "/images/ui/fiscalia.jpeg",
  },
  {
    year: "2025 – 2026",
    tag: "Experience",
    title: "Prácticas Profesionales — Data & Web",
    entity: "ILCE — Instituto Latinoamericano de la Comunicación Educativa",
    description:
      "Migración y depuración masiva de más de 100,000 registros bibliotecarios (SIABUC a KOHA) mediante scripts en Python y arquitectura Medallion para optimizar el flujo de datos. Implementación de dashboards en Streamlit y modelos de IA locales para automatizar procesos de información.",
    image: "/images/ui/practicas-profesionales.jpeg",
  },
  {
    year: "2022 – 2025",
    tag: "Education",
    title: "Ingeniería en Sistemas Computacionales",
    entity: "UVEG — Universidad Virtual del Estado de Guanajuato",
    description:
      "Graduado con honores — Promedio 95/100. Enfoque profundo en arquitectura de software, inteligencia artificial aplicada y ciberseguridad. Proyecto final: plataforma de análisis semántico de CVs con modelos de lenguaje y recuperación vectorial.",
    image: "/images/ui/uveg.jpeg",
  },
  {
    year: "2021 – 2022",
    tag: "Experience",
    title: "Desarrollador Freelance",
    entity: "Trabajo Independiente",
    description:
      "Diseño y desarrollo de soluciones web a medida para clientes locales: landing pages, e-commerce y sistemas de gestión. Primeros pasos en automatización con Python y construcción de APIs REST. Base del stack técnico que define mi trabajo hoy.",
    image: "/images/ui/freelance.jpeg",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   TAG BADGE
───────────────────────────────────────────────────────────────────────────── */
function TagBadge({ tag, isNight }: { tag?: string; isNight: boolean }) {
  if (!tag) return null;
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    Experience: {
      bg: isNight ? "rgba(0,255,255,0.08)" : "rgba(209,48,48,0.08)",
      text: isNight ? "#00e5ff" : "#D13030",
      border: isNight ? "rgba(0,255,255,0.22)" : "rgba(209,48,48,0.22)",
    },
    Education: {
      bg: isNight ? "rgba(255,0,255,0.08)" : "rgba(99,102,241,0.08)",
      text: isNight ? "#ff66ff" : "#6366f1",
      border: isNight ? "rgba(255,0,255,0.22)" : "rgba(99,102,241,0.22)",
    },
    Award: {
      bg: isNight ? "rgba(255,200,0,0.08)" : "rgba(245,158,11,0.08)",
      text: isNight ? "#ffd700" : "#d97706",
      border: isNight ? "rgba(255,200,0,0.22)" : "rgba(245,158,11,0.22)",
    },
  };
  const c = colors[tag] ?? colors.Experience;
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-widest uppercase mb-2"
      style={{
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        fontFamily: "var(--font-mono)",
      }}
    >
      {tag}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SINGLE ENTRY ROW
───────────────────────────────────────────────────────────────────────────── */
function TimelineEntry({
  item,
  index,
  isNight,
}: {
  item: TimelineEntry;
  index: number;
  isNight: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-start gap-0 w-full"
    >
      {/* ── Year column ── */}
      <div className="flex-shrink-0 w-[88px] pt-1 text-right pr-5">
        <span
          className="font-bold leading-none"
          style={{
            color: isNight ? "var(--accent-primary)" : "#D13030",
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(0.75rem, 1vw, 0.85rem)",
          }}
        >
          {item.year}
        </span>
      </div>

      {/* ── Dot on the line ── */}
      <div className="flex-shrink-0 flex flex-col items-center relative" style={{ width: "18px" }}>
        <div
          className="w-[10px] h-[10px] rounded-full mt-1.5 z-10 relative"
          style={{
            background: isNight ? "var(--accent-primary)" : "#D13030",
            boxShadow: isNight
              ? "0 0 0 3px rgba(0,255,255,0.15), 0 0 12px rgba(0,255,255,0.4)"
              : "0 0 0 3px rgba(209,48,48,0.15), 0 0 8px rgba(209,48,48,0.3)",
          }}
        />
      </div>

      {/* ── Content area ── */}
      <div className="flex flex-1 gap-6 pl-5 pb-16">
        {/* Text block */}
        <div className="flex-1 min-w-0">
          <TagBadge tag={item.tag} isNight={isNight} />

          <h3
            className="font-bold leading-tight mb-1"
            style={{
              color: isNight ? "#ffffff" : "#111111",
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
            }}
          >
            {item.title}
          </h3>

          <p
            className="mb-3 uppercase tracking-wider"
            style={{
              color: isNight ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
            }}
          >
            {item.entity}
          </p>

          <p
            className="leading-relaxed"
            style={{
              color: isNight ? "rgba(220,230,240,0.65)" : "rgba(30,30,30,0.65)",
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(0.82rem, 1.1vw, 0.9rem)",
              maxWidth: "48ch",
            }}
          >
            {item.description}
          </p>
        </div>

        {/* Image panel */}
        <div
          className="flex-shrink-0 rounded-xl overflow-hidden relative"
          style={{
            width: "clamp(200px, 28vw, 310px)",
            height: "clamp(130px, 18vw, 200px)",
            border: isNight
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 60vw, 310px"
            loading="lazy"
          />
          {/* Subtle scrim so image integrates with dark background */}
          <div
            className="absolute inset-0"
            style={{
              background: isNight
                ? "linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 100%)"
                : "linear-gradient(135deg, rgba(0,0,0,0.08) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────────────────────── */
export function TimelineSection() {
  const { theme } = useTheme();
  const isNight = theme === "neon";
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 900, damping: 90 });

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full flex flex-col items-center py-24 px-4 overflow-hidden"
    >
      {/* Subtle dot-grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isNight
            ? `radial-gradient(circle, rgba(0,255,255,0.04) 1px, transparent 1px)`
            : `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 6%, black 94%, transparent)",
        }}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full text-center mb-16 z-20 pointer-events-none"
      >
        <p
          className={`text-[11px] tracking-[0.35em] uppercase mb-3 ${isNight ? "font-mono text-[var(--accent-primary)]" : "font-sans text-[#D13030]"
            }`}
        >
          CAREER
        </p>

        <h2
          className={`text-4xl md:text-5xl font-bold mb-4 ${isNight ? "font-mono" : "font-serif"
            }`}
        >
          <span className={isNight ? "text-white" : "text-[#1A1A1A]"}>Experience </span>
          <span className={isNight ? "text-[var(--accent-primary)] italic" : "text-[#D13030] italic"}>
            &amp; Awards
          </span>
        </h2>

        <p
          className={`text-sm leading-relaxed italic opacity-50 ${isNight ? "font-mono text-[var(--text-primary)]" : "font-serif text-[#1A1A1A]"
            }`}
        >
          Cada etapa, una pincelada más en el cuadro de lo que soy.
        </p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="h-px w-20 mx-auto mt-5 origin-center"
          style={{
            background: isNight ? "rgba(0,255,255,0.3)" : "rgba(209,48,48,0.3)",
          }}
        />
      </motion.div>

      {/* ── Timeline body ── */}
      <div className="relative w-full max-w-[900px] mx-auto z-10">

        {/* Vertical line track */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{ left: "88px", width: "2px" }}
        >
          {/* Track */}
          <div
            className="absolute inset-0"
            style={{
              background: isNight
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.08)",
            }}
          />
          {/* Animated progress fill */}
          <motion.div
            className="absolute top-0 left-0 right-0 origin-top"
            style={{
              scaleY: smoothProgress,
              background: isNight
                ? "linear-gradient(to bottom, var(--accent-primary), rgba(0,255,255,0.3))"
                : "linear-gradient(to bottom, #D13030, rgba(209,48,48,0.3))",
              boxShadow: isNight ? "0 0 8px rgba(0,255,255,0.5)" : "none",
              willChange: "transform",
              height: "100%",
            }}
          />
        </div>

        {/* Entries */}
        <div className="flex flex-col">
          {TIMELINE_DATA.map((item, i) => (
            <TimelineEntry key={item.title} item={item} index={i} isNight={isNight} />
          ))}
        </div>
      </div>
    </section>
  );
}
