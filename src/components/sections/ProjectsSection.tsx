"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
type Category = "apps" | "ia" | "data" | "game";

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  image: string;
  linkCode: string;
  linkDemo: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — 4 projects per category, concise titles & descriptions
───────────────────────────────────────────────────────────────────────────── */
const CATEGORIES: { key: Category; label: string }[] = [
  { key: "apps",  label: "Apps / Web" },
  { key: "ia",    label: "IA" },
  { key: "data",  label: "Data" },
  { key: "game",  label: "Game" },
];

const PROJECTS: Record<Category, Project[]> = {
  apps: [
    {
      id: "a1",
      title: "Yukisei Portfolio",
      description: "Portfolio Zen-Tech con motor RPG-IA, temas dinámicos y audio interactivo.",
      stack: ["Next.js", "TypeScript", "Framer Motion"],
      image: "/images/projects/Project_1.png",
      linkDemo: "https://yukisei-systems.vercel.app/",
      linkCode: "https://github.com/Yukiseip/-Komorebi-Portfolio-Zen-Tech-Architecture.git",
    },
    {
      id: "a2",
      title: "CEDAL Koha",
      description: "Automatización híbrida para biblioteca ILCE integrada en el core de Koha LMS.",
      stack: ["Python", "SQL", "Docker"],
      image: "/images/projects/Project_03.png",
      linkDemo: "https://cedal-koha.ilce.edu.mx/",
      linkCode: "#",
    },
    {
      id: "a3",
      title: "Fintech Dashboard",
      description: "Dashboard analítico para visualización de datos financieros en tiempo real.",
      stack: ["React", "D3.js", "FastAPI"],
      image: "/images/projects/Project_02.png",
      linkDemo: "#",
      linkCode: "#",
    },
    {
      id: "a4",
      title: "CV Engine",
      description: "Plataforma ATS-simulada con análisis semántico de skills y recomendaciones LLM.",
      stack: ["FastAPI", "React", "Qdrant"],
      image: "/images/projects/Project_04.png",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/CV-Engine",
    },
  ],
  ia: [
    {
      id: "i1",
      title: "Yukisei CV Engine",
      description: "Diagnóstico profesional ATS con LLMs, análisis semántico en tiempo real.",
      stack: ["FastAPI", "React", "Qdrant", "Groq", "spaCy"],
      image: "/images/projects/Project_04.png",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/CV-Engine",
    },
    {
      id: "i2",
      title: "Vision-Tracker",
      description: "Visión artificial para clasificar y rastrear entidades en entornos urbanos con Edge AI.",
      stack: ["TensorFlow", "OpenCV", "C++", "CUDA"],
      image: "/images/projects/Project_05.png",
      linkDemo: "#",
      linkCode: "#",
    },
    {
      id: "i3",
      title: "Dynamic Pricing",
      description: "Optimización de precios E2E para e-commerce con NLP y bases vectoriales.",
      stack: ["Python", "Qdrant", "Sentence-Transformers"],
      image: "/images/projects/Project_06.png",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/Dynami-Pricing-System.git",
    },
    {
      id: "i4",
      title: "Fintech Intelligence",
      description: "Detección de fraude con Isolation Forest sobre pipelines analíticos Medallion.",
      stack: ["Airflow", "Spark", "Scikit-learn"],
      image: "/images/projects/Project_02.png",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/Fintech-Data-Intelligence-Ecosystem.git",
    },
  ],
  data: [
    {
      id: "d1",
      title: "Fintech Data Ecosystem",
      description: "Arquitectura Medallion con detección de fraude y orquestación analítica.",
      stack: ["Airflow", "Spark", "dbt", "PostgreSQL"],
      image: "/images/projects/Project_02.png",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/Fintech-Data-Intelligence-Ecosystem.git",
    },
    {
      id: "d2",
      title: "SaludMX Crónicas",
      description: "Dashboard epidemiológico con visualizaciones geoespaciales de microdatos INEGI.",
      stack: ["Python", "Streamlit", "DuckDB", "GeoPandas"],
      image: "/images/projects/Project_06.png",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/SaludMX-Cronicas.git",
    },
    {
      id: "d3",
      title: "Pricing Pipeline",
      description: "Pipeline E2E de precios competitivos con bases vectoriales y NLP.",
      stack: ["Python", "Airflow", "dbt", "Terraform"],
      image: "/images/projects/Project_05.png",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/Dynami-Pricing-System.git",
    },
    {
      id: "d4",
      title: "Vision Analytics",
      description: "Análisis de datos de cámaras urbanas con modelos de visión y reporting.",
      stack: ["TensorFlow", "Plotly", "FastAPI"],
      image: "/images/projects/Project_04.png",
      linkDemo: "#",
      linkCode: "#",
    },
  ],
  game: [
    {
      id: "g1",
      title: "Pixel Art Studio",
      description: "Sprites y fondos animados para juegos indie, arte visual como narrativa.",
      stack: ["Aseprite", "Blender", "After Effects"],
      image: "/images/projects/Project_03.png",
      linkDemo: "#",
      linkCode: "#",
    },
    {
      id: "g2",
      title: "Audio Generativo",
      description: "Síntesis granular y procedural para soundscapes ambientales interactivos.",
      stack: ["Max/MSP", "SuperCollider", "Web Audio API"],
      image: "/images/projects/Project_1.png",
      linkDemo: "#",
      linkCode: "#",
    },
    {
      id: "g3",
      title: "Urban Photography",
      description: "Fotografía urbana y de naturaleza con edición avanzada de composición y luz.",
      stack: ["Lightroom", "Photoshop", "Capture One"],
      image: "/images/projects/Project_04.png",
      linkDemo: "#",
      linkCode: "#",
    },
    {
      id: "g4",
      title: "Procedural World",
      description: "Generación procedural de mundos para videojuego indie con Godot.",
      stack: ["Godot", "GDScript", "Blender"],
      image: "/images/projects/Project_05.png",
      linkDemo: "#",
      linkCode: "#",
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   GHOST TABS — no background, no border on container, low-opacity ghost style
───────────────────────────────────────────────────────────────────────────── */
function GhostTabs({
  active,
  onChange,
  isNight,
}: {
  active: Category;
  onChange: (c: Category) => void;
  isNight: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.key;
        return (
          <motion.button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            whileTap={{ scale: 0.96 }}
            className="relative px-4 py-1.5 text-sm font-medium select-none cursor-pointer transition-colors rounded-md"
            style={{
              color: isActive
                ? isNight ? "rgba(255,255,255,0.92)" : "rgba(20,20,20,0.92)"
                : isNight ? "rgba(255,255,255,0.28)" : "rgba(20,20,20,0.28)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.01em",
              background: "transparent",
              border: "none",
              outline: "none",
            }}
          >
            {/* Subtle active underline only */}
            {isActive && (
              <motion.span
                layoutId="ghost-underline"
                className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full"
                style={{
                  background: isNight
                    ? "rgba(255,255,255,0.55)"
                    : "rgba(20,20,20,0.45)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT CARD — full-bleed image, hover darkens + shows two action buttons
───────────────────────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  isNight,
  index,
}: {
  project: Project;
  isNight: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const hasDemo = project.linkDemo !== "#";
  const hasCode = project.linkCode !== "#";

  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
      style={{
        aspectRatio: "16/9",
        border: isNight
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid rgba(0,0,0,0.08)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Full-bleed image */}
      <Image
        src={project.image}
        alt={project.title}
        fill
        className="object-cover"
        style={{
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        }}
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="lazy"
      />

      {/* Base gradient — always present, bottom text always readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(4,8,16,0.96) 0%, rgba(4,8,16,0.55) 38%, rgba(4,8,16,0.06) 100%)",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Hover darkening overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: "rgba(2,5,12,0.42)" }}
      />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-10 z-10">
        {/* Title + arrow icon */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="text-white font-bold leading-tight"
            style={{
              fontSize: "clamp(0.88rem, 1.3vw, 1.05rem)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {project.title}
          </h3>
          {/* Small arrow in top-right of bottom panel — matches reference */}
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5"
          >
            <path d="M2 11L11 2M11 2H5M11 2v6" />
          </svg>
        </div>

        <p
          className="leading-snug mb-3"
          style={{
            color: "rgba(200,215,235,0.68)",
            fontSize: "clamp(0.68rem, 0.88vw, 0.78rem)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {project.description}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-[10px] font-medium tracking-wide"
              style={{
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(210,225,245,0.82)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Hover action buttons — centered over image */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="hover-actions"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center gap-3 z-20 pointer-events-none"
            style={{ paddingBottom: "4.5rem" }}
          >
            {/* Live button */}
            <motion.a
              href={hasDemo ? project.linkDemo : undefined}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => !hasDemo && e.preventDefault()}
              className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: hasDemo ? "#fff" : "rgba(255,255,255,0.38)",
                fontFamily: "var(--font-sans)",
                cursor: hasDemo ? "pointer" : "not-allowed",
                letterSpacing: "0.02em",
              }}
              aria-label="Ver en live"
            >
              {/* Play / external icon */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1.5 10.5L10.5 1.5M10.5 1.5H5.5M10.5 1.5v5" />
              </svg>
              Live
            </motion.a>

            {/* GitHub button */}
            <motion.a
              href={hasCode ? project.linkCode : undefined}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => !hasCode && e.preventDefault()}
              className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: hasCode ? "#fff" : "rgba(255,255,255,0.38)",
                fontFamily: "var(--font-sans)",
                cursor: hasCode ? "pointer" : "not-allowed",
                letterSpacing: "0.02em",
              }}
              aria-label="Ver código en GitHub"
            >
              {/* GitHub icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT GRID — 2 × 2 layout (2 top, 2 bottom)
───────────────────────────────────────────────────────────────────────────── */
function ProjectGrid({
  category,
  isNight,
}: {
  category: Category;
  isNight: boolean;
}) {
  const projects = PROJECTS[category].slice(0, 4);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-2 gap-4 w-full"
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            isNight={isNight}
            index={i}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────────────────────────── */
export function ProjectsSection() {
  const { theme } = useTheme();
  const isNight = theme === "neon";
  const [activeCategory, setActiveCategory] = useState<Category>("apps");

  return (
    <section
      id="projects"
      className="relative w-full flex flex-col items-center py-24 px-4 overflow-hidden"
    >
      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isNight
            ? `radial-gradient(circle, rgba(0,255,255,0.04) 1px, transparent 1px)`
            : `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
        }}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full text-center mb-8 z-20 pointer-events-none"
      >
        <p
          className={`text-[11px] tracking-[0.35em] uppercase mb-3 ${
            isNight ? "font-mono text-[var(--accent-primary)]" : "font-sans text-[#D13030]"
          }`}
        >
          SELECTED WORK
        </p>

        <h2
          className={`text-4xl md:text-5xl font-bold mb-4 ${
            isNight ? "font-mono" : "font-serif"
          }`}
        >
          <span className={isNight ? "text-white" : "text-[#1A1A1A]"}>Recent </span>
          <span className={isNight ? "text-[var(--accent-primary)] italic" : "text-[#D13030] italic"}>
            Projects
          </span>
        </h2>

        <p
          className={`text-xs tracking-widest uppercase opacity-45 italic ${
            isNight ? "font-mono text-[var(--text-primary)]" : "font-sans text-black"
          }`}
        >
          Del prototipo a producción — con impacto real.
        </p>
      </motion.div>

      {/* ── Ghost Tabs (invisible container, no background, no border) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="relative z-10 mb-8"
        style={{ opacity: 1 }}
      >
        <GhostTabs
          active={activeCategory}
          onChange={setActiveCategory}
          isNight={isNight}
        />
      </motion.div>

      {/* ── 2×2 Project Grid ── */}
      <div className="relative z-10 w-full max-w-[980px]">
        <ProjectGrid category={activeCategory} isNight={isNight} />
      </div>

      {/* ── GitHub CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="relative z-10 mt-12"
      >
        <motion.a
          href="https://github.com/Yukiseip"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-semibold transition-all"
          style={{
            background: isNight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.75)",
            border: isNight
              ? "1px solid rgba(0,255,255,0.3)"
              : "1px solid rgba(0,0,0,0.15)",
            color: isNight ? "#00FFFF" : "#1A1A1A",
            backdropFilter: "blur(20px)",
            boxShadow: isNight
              ? "0 4px 24px rgba(0,255,255,0.06)"
              : "0 4px 24px rgba(0,0,0,0.07)",
            fontSize: "0.875rem",
            fontFamily: "var(--font-sans)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          Ver todos los proyectos →
        </motion.a>
      </motion.div>
    </section>
  );
}