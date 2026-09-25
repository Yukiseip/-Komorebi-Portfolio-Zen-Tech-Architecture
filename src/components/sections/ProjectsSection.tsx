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
      image: "/images/projects/Proyecto1.jpg",
      linkDemo: "https://yukisei-systems.vercel.app/",
      linkCode: "https://github.com/Yukiseip/-Komorebi-Portfolio-Zen-Tech-Architecture.git",
    },
    {
      id: "a2",
      title: "CEDAL Koha",
      description: "Automatización híbrida para biblioteca ILCE integrada en el core de Koha LMS.",
      stack: ["Python", "SQL", "Docker"],
      image: "/images/projects/Proyecto3.jpg",
      linkDemo: "https://cedal-koha.ilce.edu.mx/",
      linkCode: "#",
    },
    {
      id: "a3",
      title: "Moze Café POS",
      description: "Plataforma POS full-stack para operaciones de café: ventas, inventario, turnos de caja, analytics y administración segura.",
      stack: ["React", "Spring Boot", "JWT", "PostgreSQL"],
      image: "/images/projects/Proyecto4.jpg",
      linkDemo: "#",
      linkCode: "https://github.com/Yukiseip/POS-Moze-Cafe",
    },
    {
      id: "a4",
      title: "CV Engine",
      description: "Plataforma ATS-simulada con análisis semántico de skills y recomendaciones LLM.",
      stack: ["FastAPI", "React", "Qdrant"],
      image: "/images/projects/Proyecto2.jpg",
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

import {
  SiNextdotjs,
  SiTypescript,
  SiFramer,
  SiPython,
  SiDocker,
  SiReact,
  SiFastapi,
  SiTensorflow,
  SiOpencv,
  SiCplusplus,
  SiNvidia,
  SiApacheairflow,
  SiApachespark,
  SiScikitlearn,
  SiDbt,
  SiPostgresql,
  SiStreamlit,
  SiTerraform,
  SiPlotly,
  SiAseprite,
  SiBlender,
  SiGodotengine,
  SiJavascript,
  SiSpringboot,
  SiJsonwebtokens,
} from "react-icons/si";

import { FaDatabase, FaBrain, FaCode, FaExternalLinkAlt, FaGithub, FaPalette, FaImage, FaFilm } from "react-icons/fa";
import { TbWaveSine, TbCpu } from "react-icons/tb";

/* ─────────────────────────────────────────────────────────────────────────────
   TECH ICON HELPER
───────────────────────────────────────────────────────────────────────────── */
function getTechIcon(name: string) {
  const key = name.toLowerCase();
  if (key.includes("next")) return <SiNextdotjs className="text-white" />;
  if (key.includes("typescript")) return <SiTypescript className="text-[#3178C6]" />;
  if (key.includes("javascript")) return <SiJavascript className="text-[#F7DF1E]" />;
  if (key.includes("framer")) return <SiFramer className="text-[#0055FF]" />;
  if (key.includes("python")) return <SiPython className="text-[#3776AB]" />;
  if (key.includes("sql") || key.includes("duckdb")) return <FaDatabase className="text-[#E38C00]" />;
  if (key.includes("docker")) return <SiDocker className="text-[#2496ED]" />;
  if (key.includes("react")) return <SiReact className="text-[#61DAFB]" />;
  if (key.includes("fastapi")) return <SiFastapi className="text-[#05998B]" />;
  if (key.includes("spring")) return <SiSpringboot className="text-[#6DB33F]" />;
  if (key.includes("jwt")) return <SiJsonwebtokens className="text-[#D63AFF]" />;
  if (key.includes("qdrant") || key.includes("groq") || key.includes("spacy") || key.includes("sentence") || key.includes("nlp") || key.includes("llm")) return <FaBrain className="text-[#A855F7]" />;
  if (key.includes("tensor")) return <SiTensorflow className="text-[#FF6F00]" />;
  if (key.includes("opencv")) return <SiOpencv className="text-[#5C3EE8]" />;
  if (key.includes("c++")) return <SiCplusplus className="text-[#00599C]" />;
  if (key.includes("cuda")) return <SiNvidia className="text-[#76B900]" />;
  if (key.includes("airflow")) return <SiApacheairflow className="text-[#017CEE]" />;
  if (key.includes("spark")) return <SiApachespark className="text-[#E25A1C]" />;
  if (key.includes("scikit")) return <SiScikitlearn className="text-[#F7931E]" />;
  if (key.includes("dbt")) return <SiDbt className="text-[#FF694B]" />;
  if (key.includes("postgres")) return <SiPostgresql className="text-[#4169E1]" />;
  if (key.includes("streamlit")) return <SiStreamlit className="text-[#FF4B4B]" />;
  if (key.includes("geopandas")) return <FaDatabase className="text-[#139C5A]" />;
  if (key.includes("terraform")) return <SiTerraform className="text-[#844FBA]" />;
  if (key.includes("plotly") || key.includes("d3")) return <SiPlotly className="text-[#3F4F75]" />;
  if (key.includes("aseprite")) return <SiAseprite className="text-[#7D54C1]" />;
  if (key.includes("blender")) return <SiBlender className="text-[#F5792A]" />;
  if (key.includes("after effects")) return <FaFilm className="text-[#9999FF]" />;
  if (key.includes("photoshop") || key.includes("lightroom")) return <FaImage className="text-[#31A8FF]" />;
  if (key.includes("adobe")) return <FaPalette className="text-[#FF0000]" />;
  if (key.includes("capture one")) return <FaCode className="text-[#2563EB]" />;
  if (key.includes("max") || key.includes("supercollider") || key.includes("audio")) return <TbWaveSine className="text-[#06B6D4]" />;
  if (key.includes("godot") || key.includes("gdscript")) return <SiGodotengine className="text-[#478CBF]" />;
  return <TbCpu className="text-white/70" />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT CARD — 3D Flip Card on Hover
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
  const [isFlipped, setIsFlipped] = useState(false);
  const hasDemo = project.linkDemo !== "#";
  const hasCode = project.linkCode !== "#";

  return (
    <motion.div
      className="relative w-full h-[280px] sm:h-[320px] [perspective:1000px] cursor-pointer group select-none"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
    >
      {/* 3D Flip Card Container */}
      <div
        className="w-full h-full relative duration-700 [transform-style:preserve-3d] rounded-2xl"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        {/* ─── FRONT FACE ─── */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(0deg)] ${
            isNight
              ? "border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              : "border border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
          }`}
        >
          {/* Full Clear Image */}
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 50vw"
            loading="lazy"
          />

          {/* Bottom Title Bar — display serif, no dot, no button */}
          <div className="absolute bottom-0 inset-x-0 px-4 pb-4 pt-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent">
            <h3
              style={{
                fontFamily: "'Georgia', 'Playfair Display', serif",
                fontWeight: 700,
                letterSpacing: "0.04em",
                fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                lineHeight: 1.2,
              }}
              className="text-white"
            >
              {project.title}
            </h3>
          </div>
        </div>

        {/* ─── BACK FACE ─── */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl p-5 sm:p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            background: isNight
              ? "linear-gradient(145deg, #1a0e00 0%, #2d1a00 35%, #3d2200 65%, #1a0e00 100%)"
              : "linear-gradient(145deg, #2c1a00 0%, #3d2300 35%, #5a3200 65%, #2c1a00 100%)",
            border: isNight
              ? "1px solid rgba(200,140,40,0.45)"
              : "1px solid rgba(200,140,40,0.35)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,200,80,0.12)",
          }}
        >
          {/* Top: Title & Description */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2 pb-2" style={{ borderBottom: "1px solid rgba(200,140,40,0.3)" }}>
              <h3
                style={{
                  fontFamily: "'Georgia', 'Playfair Display', serif",
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  color: "#F5C842",
                  fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                  textShadow: "0 0 18px rgba(245,200,66,0.35)",
                }}
              >
                {project.title}
              </h3>
              <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: "rgba(200,140,40,0.6)" }}>
                PROYECTO
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed line-clamp-3 mb-2" style={{ color: "rgba(255,235,180,0.88)" }}>
              {project.description}
            </p>
          </div>

          {/* Middle: Tech Stack with Icons */}
          <div className="my-1">
            <span
              className="text-[10px] font-mono uppercase tracking-wider block mb-2 font-semibold"
              style={{ color: "rgba(200,140,40,0.7)" }}
            >
              Tecnologías
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {project.stack.map((tech) => (
                <div
                  key={tech}
                  className="flex items-center gap-1.5 text-xs transition-transform hover:scale-105"
                  title={tech}
                >
                  <span className="text-base sm:text-lg flex-shrink-0" aria-hidden="true">
                    {getTechIcon(tech)}
                  </span>
                  <span className="font-mono text-[11px]" style={{ color: "rgba(255,220,150,0.85)" }}>
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom: Action Buttons */}
          <div
            className="flex items-center gap-2.5 pt-3"
            style={{ borderTop: "1px solid rgba(200,140,40,0.3)" }}
          >
            {hasDemo && (
              <a
                href={project.linkDemo}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: "rgba(200,140,40,0.18)",
                  border: "1px solid rgba(200,140,40,0.45)",
                  color: "#F5C842",
                }}
              >
                <FaExternalLinkAlt size={10} />
                <span>Live Demo</span>
              </a>
            )}
            {hasCode && (
              <a
                href={project.linkCode}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(200,140,40,0.25)",
                  color: "rgba(255,220,150,0.85)",
                }}
              >
                <FaGithub size={13} />
                <span>Código</span>
              </a>
            )}
            {!hasDemo && !hasCode && (
              <span className="text-xs italic font-mono" style={{ color: "rgba(200,140,40,0.55)" }}>
                Proyecto interno / privado
              </span>
            )}
          </div>
        </div>
      </div>
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
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
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
      suppressHydrationWarning
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
          className={`inline-flex items-center justify-center gap-1.5 text-[11px] tracking-[0.35em] uppercase mb-3 ${
            isNight ? "font-mono text-[var(--accent-primary)]" : "font-sans text-[#D13030]"
          }`}
        >
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="font-bold select-none"
          >
            &gt;
          </motion.span>
          <span>SELECTED WORK</span>
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