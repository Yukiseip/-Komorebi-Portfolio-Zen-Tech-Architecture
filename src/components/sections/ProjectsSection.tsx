"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useCallback } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA — Preserved exactly from original
───────────────────────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "01",
    category: "Full Stack",
    title: "Yukisei | AI & Data Engineering",
    description:
      "Ecosistema web de alto rendimiento con arquitectura Zen-Tech. Incluye un motor de diálogo RPG asistido por IA (Gemini/Groq) y un sistema de temas dinámico con persistencia y audio interactivo.",
    stack: ["NEXT.JS", "TYPESCRIPT", "FRAMER MOTION", "GEMINI AI", "GROQ", "WEB AUDIO API"],
    image:
      "/images/projects/Project_1.png",
    linkDemo: "https://yukisei-systems.vercel.app/",
    linkCode: "https://github.com/Yukiseip/-Komorebi-Portfolio-Zen-Tech-Architecture.git",
  },
  {
    id: "02",
    category: "Data Engineering",
    title: "FINTECH DATA INTELLIGENCE",
    description:
      "Ecosistema contenerizado para procesamiento masivo de transacciones. Implementa arquitectura Medallion, detección de fraude con Isolation Forest y orquestación de pipelines analíticos.",
    stack: ["AIRFLOW", "SPARK", "DBT", "POSTGRESQL", "SCIKIT-LEARN", "GRAFANA"],
    image:
      "/images/projects/Project_02.png",
    linkDemo: "#",
    linkCode: "https://github.com/Yukiseip/Fintech-Data-Intelligence-Ecosystem.git",
  },
  {
    id: "03",
    category: "Fullstack Engineering",
    title: "CEDAL KOHA AUTOMATION",
    description:
      "Automatización híbrida para la biblioteca ILCE. Scripts de extracción masiva de metadatos integrados directamente con el core de Koha LMS y una interfaz unificada.",
    stack: ["PYTHON", "SQL", "AIRFLOW", "MARC21", "LINUX", "DOCKER"],
    image:
      "/images/projects/Project_03.png",
    linkDemo: "https://cedal-koha.ilce.edu.mx/",
    linkCode: "#",
  },
  {
    id: "04",
    category: "AI & Data",
    title: "YUKISEI CV ENGINE",
    description:
      "Plataforma de diagnóstico profesional que simula la evaluación de un ATS y el criterio de un reclutador mediante LLMs. Ofrece análisis semántico de skills y recomendaciones críticas en tiempo real.",
    stack: ["FASTAPI", "REACT", "QDRANT", "GROQ", "SPACY", "DOCKER"],
    image:
      "/images/projects/Project_04.png",
    linkDemo: "#",
    linkCode: "https://github.com/Yukiseip/CV-Engine",
  },
  {
    id: "05",
    category: "Data Engineering",
    title: "DYNAMIC PRICING SYSTEM",
    description:
      "Solución E2E para optimización de precios competitivos en E-commerce. Utiliza matching inteligente de productos mediante NLP y bases de datos vectoriales para ajustes de margen automáticos.",
    stack: ["PYTHON", "AIRFLOW", "DBT", "QDRANT", "SENTENCE-TRANSFORMERS", "TERRAFORM"],
    image:
      "/images/projects/Project_05.png",
    linkDemo: "#",
    linkCode: "https://github.com/Yukiseip/Dynami-Pricing-System.git",
  },
  {
    id: "06",
    category: "Data Analysis",
    title: "SALUDMX CRÓNICAS",
    description:
      "Dashboard epidemiológico que transforma microdatos del INEGI en visualizaciones geoespaciales interactivas. Analiza tendencias de mortalidad y riesgos sanitarios por entidad federativa.",
    stack: ["PYTHON", "STREAMLIT", "DUCKDB", "PANDAS", "PLOTLY", "GEOPANDAS"],
    image:
      "/images/projects/Project_06.png",
    linkDemo: "#",
    linkCode: "https://github.com/Yukiseip/SaludMX-Cronicas.git",
  },
  {
    id: "07",
    category: "Machine Learning Applied",
    title: "VISION-TRACKER",
    description:
      "Modelo de visión artificial capaz de clasificar y rastrear entidades en movimiento en entornos urbanos ruidosos usando hardware de borde (Edge AI).",
    stack: ["TENSORFLOW", "OPENCV", "C++", "CUDA"],
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTS (GemTag, GlassButton) — Preserved logic
───────────────────────────────────────────────────────────────────────────── */
function GemTag({ tech, index, isNight }: { tech: string; index: number; isNight: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.span
      initial={{ opacity: 0, y: 12, scale: 0.88 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.07, transition: { duration: 0.15, ease: "easeOut" } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative inline-flex items-center select-none cursor-default px-[14px] py-[5px] rounded-full"
      style={{
        backdropFilter: "blur(10px)",
        background: isNight ? "rgba(0,255,255,0.07)" : "rgba(255,255,255,0.65)",
        border: isNight ? "1px solid rgba(0,255,255,0.22)" : "1px solid rgba(209,48,48,0.18)",
      }}
    >
      <span className={`relative z-10 text-[10px] font-mono uppercase tracking-[0.18em] font-semibold ${isNight ? "text-[var(--accent-primary)]" : "text-[#C02828]"}`}>
        {tech}
      </span>
    </motion.span>
  );
}

function GlassButton({ href, label, primary, disabled, isNight }: { href: string; label: string; primary: boolean; disabled: boolean; isNight: boolean }) {
  return (
    <motion.a
      href={!disabled ? href : undefined}
      target={!disabled ? "_blank" : undefined}
      rel="noopener noreferrer"
      whileHover={!disabled ? { y: -3, scale: 1.03 } : {}}
      className="relative px-[22px] py-[10px] rounded-[8px] overflow-hidden flex items-center justify-center transition-opacity"
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        backdropFilter: "blur(14px)",
        background: primary ? (isNight ? "rgba(0,255,255,0.12)" : "rgba(26,26,26,0.9)") : (isNight ? "rgba(0,255,255,0.04)" : "rgba(255,255,255,0.7)"),
        border: primary ? (isNight ? "1px solid rgba(0,255,255,0.55)" : "1px solid rgba(26,26,26,0.8)") : (isNight ? "1px solid rgba(0,255,255,0.25)" : "1px solid rgba(26,26,26,0.25)"),
      }}
    >
      <span className="relative z-10 text-[11px] font-mono uppercase tracking-[0.2em] font-bold" style={{ color: isNight ? (primary ? "#00FFFF" : "rgba(0,255,255,0.7)") : (primary ? "#FFFFFF" : "#1A1A1A") }}>
        {label}
      </span>
    </motion.a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION HEADER — Hierarchy Refactored
───────────────────────────────────────────────────────────────────────────── */
function SectionHeader({ isNight }: { isNight: boolean }) {
  const accentColor = isNight ? "#00FFFF" : "#D13030";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full flex flex-col items-center pt-24 pb-4 z-10 overflow-hidden"
    >
      {/* ── Dot-grid background — textural filling ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isNight
            ? `radial-gradient(circle, rgba(0,255,255,0.15) 1px, transparent 1px)`
            : `radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      />

      {/* ── Eyebrow label ── */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px w-12" style={{ background: isNight ? "rgba(0,255,255,0.4)" : "rgba(209,48,48,0.3)" }} />
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-medium" style={{ color: accentColor }}>
          {isNight ? "sys.module // PROJECTS" : "Selección de Obras"}
        </span>
        <div className="h-px w-12" style={{ background: isNight ? "rgba(0,255,255,0.4)" : "rgba(209,48,48,0.3)" }} />
      </div>

      {/* ── Main Title — DOMINANT SCALE ── */}
      <div className="px-4 text-center mb-6">
        <h2
          className={`font-light uppercase leading-none tracking-widest ${isNight ? "font-mono text-glow-cyan" : "font-serif text-[#1A1A1A]"
            }`}
          style={{
            fontSize: "clamp(2.5rem, 10vw, 6.5rem)",
            color: isNight ? "var(--accent-primary)" : "#1A1A1A"
          }}
        >
          Proyectos
        </h2>
      </div>

      {/* ── Subtitle — Controlled width to avoid empty feel ── */}
      <p
        className={`text-center text-xs sm:text-sm tracking-[0.2em] uppercase max-w-[52ch] px-6 mb-10 leading-relaxed opacity-70 ${isNight ? "font-mono text-[var(--text-primary)]" : "font-sans text-black"
          }`}
      >
        {isNight
          ? "/* Code Integrity & Technical Excellence */"
          : "Sistemas curados que priorizan la solidez estructural y el impacto en producción"}
      </p>

      {/* ── Flow Line → First Project ── */}
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="origin-top w-px h-20"
        style={{
          background: isNight
            ? "linear-gradient(to bottom, rgba(0,255,255,0.5), transparent)"
            : "linear-gradient(to bottom, rgba(209,48,48,0.3), transparent)",
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT STAGE — Single Case Study
───────────────────────────────────────────────────────────────────────────── */
function ProjectStage({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) {
  const { theme } = useTheme();
  const isNight = theme === "neon";
  const isEven = index % 2 === 0;
  const stageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const yImg = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const yText = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // First project is the LCP element — load it eagerly with priority
  const isFirst = index === 0;

  return (
    <div ref={stageRef} className="relative w-full flex flex-col items-center py-20 md:py-28 px-4 overflow-hidden">
      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Image Block */}
        <motion.div style={{ y: yImg }} className={`${isEven ? "order-1" : "order-1 lg:order-2"}`}>
          <div
            className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-500 ${isNight ? 'bg-[#0a0a0a]' : 'bg-gray-100'}`}
            style={{
              boxShadow: isNight
                ? "0 20px 50px rgba(0,255,255,0.1), 0 0 0 1px rgba(0,255,255,0.2)"
                : "0 25px 50px rgba(209,48,48,0.15), 0 0 0 1px rgba(209,48,48,0.1)",
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              quality={isFirst ? 85 : 75}
              priority={isFirst}
              loading={isFirst ? "eager" : "lazy"}
              sizes="(max-width: 1024px) 100vw, (max-width: 1200px) 50vw, 560px"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Text Block */}
        <motion.div style={{ y: yText }} className={`flex flex-col ${isEven ? "order-2" : "order-2 lg:order-1"}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-mono tracking-[0.3em] opacity-80 uppercase" style={{ color: isNight ? "#00FFFF" : "#D13030" }}>Project</span>
            <span className="text-xl font-bold font-mono" style={{ color: isNight ? "#00FFFF" : "#D13030" }}>{project.id}</span>
          </div>
          <h3 className={`text-4xl md:text-5xl font-black uppercase mb-6 tracking-tighter ${isNight ? "font-mono" : "font-serif"}`}>
            {project.title}
          </h3>
          <p className="text-sm md:text-base opacity-70 mb-8 leading-relaxed max-w-[50ch]">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-10">
            {project.stack.map((tech, i) => <GemTag key={tech} tech={tech} index={i} isNight={isNight} />)}
          </div>
          <div className="flex gap-4">
            <GlassButton href={project.linkDemo} label="Live Demo" primary disabled={project.linkDemo === "#"} isNight={isNight} />
            <GlassButton href={project.linkCode} label="Source" primary={false} disabled={project.linkCode === "#"} isNight={isNight} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { theme } = useTheme();
  return (
    <section id="projects" className="relative w-full flex flex-col bg-transparent">
      <SectionHeader isNight={theme === "neon"} />
      <div className="flex flex-col">
        {PROJECTS.map((project, index) => (
          <ProjectStage key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}