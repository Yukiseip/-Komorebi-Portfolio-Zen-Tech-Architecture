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
    category: "AI & Data",
    title: "LEX-VERIFY AI RAG",
    description:
      "Plataforma inteligente para la extracción y análisis automatizado de sentencias judiciales utilizando Retrieval-Augmented Generation (RAG). Redujo el tiempo de búsqueda en firmas legales en un 85%.",
    stack: ["PYTHON", "FASTAPI", "LANGCHAIN", "POSTGRESQL"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#",
  },
  {
    id: "02",
    category: "Frontend Architecture",
    title: "DASHBOARD SALUD-MX",
    description:
      "Visualización en tiempo real de mortalidad crónica. Sistema hiper-optimizado de renderizado geoespacial utilizando Deck.gl y WebGL para manejar más de 1M de puntos de datos sin latencia.",
    stack: ["NEXT.JS", "DECK.GL", "TAILWIND", "TYPESCRIPT"],
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#",
  },
  {
    id: "03",
    category: "Fullstack Engineering",
    title: "CEDAL KOHA AUTOMATION",
    description:
      "Automatización híbrida para la biblioteca ILCE. Scripts de extracción masiva de metadatos integrados directamente con el core de Koha LMS y una interfaz unificada.",
    stack: ["PYTHON", "SQL", "BASH", "REACT"],
    image:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
    linkDemo: "https://cedal-koha.ilce.edu.mx/",
    linkCode: "#",
  },
  {
    id: "04",
    category: "System Administration",
    title: "NEXUS DEVOPS PIPELINES",
    description:
      "Arquitectura de despliegue continuo y monitorización de servidores Linux usando Docker, Kubernetes y Grafana, logrando 99.9% de uptime.",
    stack: ["DOCKER", "KUBERNETES", "GRAFANA", "BASH"],
    image:
      "https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#",
  },
  {
    id: "05",
    category: "Cybersecurity",
    title: "SHADOW-NET SECURE",
    description:
      "Implementación de protocolos de seguridad Zero-Trust para endpoints corporativos, previniendo filtraciones de datos e integrando un firewall reactivo basado en machine learning.",
    stack: ["RUST", "PYTHON", "WIRESHARK", "LINUX"],
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#",
  },
  {
    id: "06",
    category: "E-Commerce Solutions",
    title: "AURA VIRTUAL STORE",
    description:
      "Plataforma de comercio electrónico altamente escalable con pagos integrados, inventario en tiempo real y una arquitectura headless utilizando Next.js y un backend Django.",
    stack: ["DJANGO", "NEXT.JS", "STRIPE", "REDIS"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#",
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
      whileHover={{ y: -3, scale: 1.07 }}
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
        opacity: disabled ? 0.38 : 1,
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
            fontSize: "clamp(3.5rem, 10vw, 6.5rem)",
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

  return (
    <div ref={stageRef} className="relative w-full flex flex-col items-center py-20 md:py-28 px-4 overflow-hidden">
      <div className="relative z-10 w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Image Block */}
        <motion.div style={{ y: yImg }} className={`${isEven ? "order-1" : "order-1 lg:order-2"}`}>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image src={project.image} alt={project.title} fill className="object-cover" quality={90} />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
          </div>
        </motion.div>

        {/* Text Block */}
        <motion.div style={{ y: yText }} className={`flex flex-col ${isEven ? "order-2" : "order-2 lg:order-1"}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-mono tracking-[0.3em] opacity-50 uppercase" style={{ color: isNight ? "#00FFFF" : "#D13030" }}>Project</span>
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