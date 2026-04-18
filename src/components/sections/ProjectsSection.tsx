"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const PROJECTS = [
  {
    id: "01",
    category: "AI & Data",
    title: "LEX-VERIFY AI RAG",
    description: "Plataforma inteligente para la extracción y análisis automatizado de sentencias judiciales utilizando Retrieval-Augmented Generation (RAG). Redujo el tiempo de búsqueda en firmas legales en un 85%.",
    stack: ["PYTHON", "FASTAPI", "LANGCHAIN", "POSTGRESQL"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#"
  },
  {
    id: "02",
    category: "Frontend Architecture",
    title: "DASHBOARD SALUD-MX",
    description: "Visualización en tiempo real de mortalidad crónica. Sistema hiper-optimizado de renderizado geoespacial utilizando Deck.gl y WebGL para manejar más de 1M de puntos de datos sin latencia.",
    stack: ["NEXT.JS", "DECK.GL", "TAILWIND", "TYPESCRIPT"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#"
  },
  {
    id: "03",
    category: "Fullstack Engineering",
    title: "CEDAL KOHA AUTOMATION",
    description: "Automatización híbrida para la biblioteca ILCE. Scripts de extracción masiva de metadatos integrados directamente con el core de Koha LMS y una interfaz unificada.",
    stack: ["PYTHON", "SQL", "BASH", "REACT"],
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
    linkDemo: "https://cedal-koha.ilce.edu.mx/",
    linkCode: "#"
  },
  {
    id: "04",
    category: "System Administration",
    title: "NEXUS DEVOPS PIPELINES",
    description: "Arquitectura de despliegue continuo y monitorización de servidores Linux usando Docker, Kubernetes y Grafana, logrando 99.9% de uptime.",
    stack: ["DOCKER", "KUBERNETES", "GRAFANA", "BASH"],
    image: "https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#"
  },
  {
    id: "05",
    category: "Cybersecurity",
    title: "SHADOW-NET SECURE",
    description: "Implementación de protocolos de seguridad Zero-Trust para endpoints corporativos, previniendo filtraciones de datos e integrando un firewall reactivo basado en machine learning.",
    stack: ["RUST", "PYTHON", "WIRESHARK", "LINUX"],
    image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#"
  },
  {
    id: "06",
    category: "E-Commerce Solutions",
    title: "AURA VIRTUAL STORE",
    description: "Plataforma de comercio electrónico altamente escalable con pagos integrados, inventario en tiempo real y una arquitectura headless utilizando Next.js y un backend Django.",
    stack: ["DJANGO", "NEXT.JS", "STRIPE", "REDIS"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#"
  },
  {
    id: "07",
    category: "Machine Learning applied",
    title: "VISION-TRACKER",
    description: "Modelo de visión artificial capaz de clasificar y rastrear entidades en movimiento en entornos urbanos ruidosos usando hardware de borde (Edge AI).",
    stack: ["TENSORFLOW", "OPENCV", "C++", "CUDA"],
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=800&q=80",
    linkDemo: "#",
    linkCode: "#"
  }
];

function ProjectBlock({ project, index }: { project: typeof PROJECTS[0], index: number }) {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  // Scrollytelling configuration
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });

  // Micro-parallax
  const yPhoto = useTransform(smoothProgress, [0, 1], [-100, 100]);
  const yText = useTransform(smoothProgress, [0, 1], [50, -50]);

  // Liquid / Expansion reveal trick
  const opacityReveal = useTransform(smoothProgress, [0.1, 0.4], [0, 1]);
  const scaleReveal = useTransform(smoothProgress, [0.1, 0.4], [0.8, 1]);

  return (
    <div ref={ref} className="relative min-h-screen py-32 flex flex-col justify-center items-center overflow-hidden border-b border-white/5 last:border-0 w-full z-10 px-6">

      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* ================= LEFT: VISUAL IMMERSIVE ================= */}
        <motion.div
          style={{ y: yPhoto, opacity: opacityReveal, scale: scaleReveal }}
          className="lg:col-span-6 relative flex flex-col items-start w-full h-[50vh] lg:h-[70vh] mt-12"
        >
          {/* ── Project number — single clean element, no overlap ── */}
          <div className="absolute -top-8 left-0 z-20 flex items-center gap-3 select-none pointer-events-none">
            <span
              className={`text-[2.5rem] md:text-[3rem] font-black leading-none tabular-nums
                ${theme === 'sakura' ? 'text-[#D13030] font-serif' : 'text-[var(--accent-primary)] font-mono'}`}
              style={theme === 'neon' ? { textShadow: '0 0 12px var(--accent-primary)' } : {}}
            >
              {project.id}
            </span>
            <div className="flex flex-col gap-0.5">
              <span className={`w-10 h-[2px] ${theme === 'sakura' ? 'bg-[#D13030]' : 'bg-[var(--accent-primary)]'}`} />
              <span className={`text-[9px] font-mono tracking-[0.22em] uppercase opacity-50
                ${theme === 'sakura' ? 'text-black' : 'text-white'}`}>
                {project.category}
              </span>
            </div>
          </div>

          {/* Mask-Image Image Block */}
          <div
            className="w-full h-full relative z-10 shadow-2xl"
            style={{
              WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 100%)",
              maskImage: "radial-gradient(circle at center, black 40%, transparent 100%)"
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              quality={80}
            />
            {/* Color Overlay */}
            <div className={`absolute inset-0 mix-blend-color ${theme === 'sakura' ? 'bg-[#FFB7C5]/30' : 'bg-[#00FFFF]/20'}`} />
          </div>
        </motion.div>

        {/* ================= RIGHT: NARRATIVE ================= */}
        <motion.div
          style={{ y: yText }}
          className="lg:col-span-6 flex flex-col z-20"
        >
          <span className={`text-xs md:text-sm uppercase tracking-widest font-bold mb-4
            ${theme === 'sakura' ? 'text-[#D13030]' : 'text-[var(--accent-primary)]'}
          `}>
            {/* category already shown in the number badge */}
          </span>
          <h3 className={`text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tighter uppercase
            ${theme === 'sakura' ? 'font-serif text-[#1A1A1A]' : 'font-mono text-white text-glow-cyan'}
          `}>
            {project.title}
          </h3>

          <p className={`text-base md:text-lg leading-relaxed max-w-[50ch] mb-10
            ${theme === 'sakura' ? 'font-sans text-gray-700' : 'font-mono text-[var(--text-secondary)]'}
          `}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className={`text-xs md:text-sm font-mono uppercase tracking-widest px-3 py-1 border
                  ${theme === 'sakura' ? 'border-gray-300 text-gray-600 bg-white/50' : 'border-[var(--text-secondary)] text-[var(--text-secondary)] bg-black/50'}
                `}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-row gap-6">
            {/* Demo link — opens in new tab; shows as disabled when no real URL */}
            <a
              href={project.linkDemo !== '#' ? project.linkDemo : undefined}
              target={project.linkDemo !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-disabled={project.linkDemo === '#'}
              onClick={project.linkDemo === '#' ? (e) => e.preventDefault() : undefined}
              className={`px-6 py-3 text-xs md:text-sm font-bold font-mono tracking-widest uppercase transition-all duration-300
                ${project.linkDemo === '#' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${theme === 'sakura'
                  ? 'bg-[#1A1A1A] text-white hover:bg-[#D13030]'
                  : 'bg-[var(--accent-primary)] text-black hover:shadow-[0_0_15px_var(--accent-primary)] hover:bg-white'
                }
              `}
            >
              [ Live Demo ]
            </a>
            {/* Code link — opens in new tab; shows as disabled when no real URL */}
            <a
              href={project.linkCode !== '#' ? project.linkCode : undefined}
              target={project.linkCode !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-disabled={project.linkCode === '#'}
              onClick={project.linkCode === '#' ? (e) => e.preventDefault() : undefined}
              className={`px-6 py-3 text-xs md:text-sm font-bold font-mono tracking-widest uppercase transition-all duration-300 border
                ${project.linkCode === '#' ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${theme === 'sakura'
                  ? 'border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  : 'border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black hover:shadow-[0_0_15px_var(--accent-primary)]'
                }
              `}
            >
              [ Código ]
            </a>
          </div>

        </motion.div>

      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="projects" className="relative w-full z-10 flex flex-col bg-transparent overflow-hidden">
      {/* ── Section Header ── */}
      <div className="relative w-full flex flex-col items-center pt-32 pb-4 pointer-events-none z-0">
        {/* Supratitle — real heading size */}
        <div className="relative overflow-hidden mb-2">
          <motion.p
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className={`
              ${theme === 'sakura'
                ? 'font-serif italic text-[1.4rem] md:text-[2rem] text-[#1A1A1A]/60 tracking-wide'
                : 'font-mono text-[1rem] md:text-[1.4rem] text-[var(--accent-primary)]/70 tracking-[0.3em] uppercase'
              }`}
          >
            {theme === 'sakura' ? '— Proyectos —' : '[ PROJECTS // v2.0 ]'}
          </motion.p>
        </div>

        {/* Main title */}
        <div className="relative overflow-hidden px-2 sm:px-4">
          <motion.h2
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className={`font-black uppercase leading-none
              ${theme === 'sakura'
                ? 'font-serif text-[#1A1A1A] tracking-tight'
                : 'font-mono tracking-tighter'
              }`}
            style={{
              fontSize: "clamp(3rem, 16vw, 13rem)",
              ...(theme === 'neon' ? {
                WebkitTextStroke: "2px var(--accent-primary)",
                color: "transparent",
                textShadow: "0 0 40px rgba(0,255,255,0.35)",
              } : {}),
            }}
          >
            Archivo
          </motion.h2>
        </div>


        {/* Underline rule — centered under the two headings */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className={`h-[1.5px] w-80 mt-4 origin-center
            ${theme === 'sakura' ? 'bg-gradient-to-r from-transparent via-[#D13030]/60 to-transparent' : 'bg-gradient-to-r from-transparent via-[var(--accent-primary)]/60 to-transparent'}`}
        />
      </div>

      <div className="relative z-10 flex flex-col">
        {PROJECTS.map((project, index) => (
          <ProjectBlock key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
