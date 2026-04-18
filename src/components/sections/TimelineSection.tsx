"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const TIMELINE_DATA = [
  {
    year: "2025 - 2026",
    title: "Prácticas Profesionales",
    entity: "ILCE (Instituto Latinoamericano de la Comunicación Educativa)",
    description: "Automatización de datos y filtrado de información. Optimización del portal institucional CEDAL-KOHA."
  },
  {
    year: "2022 - 2025",
    title: "Ingeniería en Sistemas Computacionales",
    entity: "UVEG",
    description: "Graduado con honores (Promedio 95). Enfoque en arquitectura de software, inteligencia artificial y ciberseguridad."
  },
  {
    year: "2019 - 2022",
    title: "Desarrollador freelance",
    entity: "Trabajo independiente",
    description: "Enfocado en el desarrollo de soluciones web y software."
  }
];

export function TimelineSection() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });

  return (
    <section id="experience" ref={containerRef} className="relative min-h-screen py-32 px-6 w-full flex flex-col justify-center items-center z-10 bg-transparent">
      
      {/* SVG filter strictly for the fluid reveal */}
      <svg className="fixed h-0 w-0 pointer-events-none">
        <defs>
          <filter id="ink-reveal-timeline" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      
      <div className="w-full text-center mb-24 z-20">
        <motion.h2 
          initial={theme === 'sakura' ? { clipPath: "inset(100% 0 0 0)", filter: "url(#ink-reveal-timeline)" } : { clipPath: "inset(100% 0 0 0)" }}
          whileInView={theme === 'sakura' ? { clipPath: "inset(0% 0 0 0)", filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))" } : { clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className={`text-4xl md:text-5xl font-light tracking-widest uppercase
            ${theme === "sakura" ? "font-serif text-[#1A1A1A]" : "font-mono text-[var(--accent-primary)] text-glow-cyan"}
          `}
        >
          Trayectoria
        </motion.h2>

        {/* Elegant subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className={`mt-4 max-w-lg mx-auto
            ${theme === 'sakura'
              ? 'font-serif italic text-gray-500 text-sm md:text-base leading-relaxed'
              : 'font-mono text-[var(--text-secondary)] text-xs md:text-sm tracking-widest opacity-60'
            }`}
        >
          {theme === 'sakura'
            ? '"Cada etapa, una pincelada más en el cuadro de lo que soy."'
            : '// ejecutando historial de versiones... commit log completo'
          }
        </motion.p>

        {/* Thin decorative rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className={`h-px w-24 mx-auto mt-5 origin-center
            ${theme === 'sakura' ? 'bg-[#D13030]/30' : 'bg-[var(--accent-primary)]/30'}`}
        />
      </div>

      <div className="relative w-full max-w-[800px] mx-auto flex flex-col gap-24 z-20">
        
        {/* Animated Vertical Line (SVG) */}
        <div className="absolute top-0 bottom-0 left-[27px] md:left-1/2 md:-translate-x-1/2 w-[2px]">
           {/* Background line track */}
           <div className={`absolute inset-0 w-full h-full ${theme === 'sakura' ? 'bg-black/10' : 'bg-white/10'}`} />
           {/* Progress line */}
           <motion.div 
             className={`absolute top-0 w-full origin-top ${theme === 'sakura' ? 'bg-[#D13030]' : 'bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]'}`}
             style={{ scaleY: smoothProgress, willChange: "transform" }}
           />
        </div>

        {TIMELINE_DATA.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex flex-col md:flex-row items-start md:items-center w-full
                ${isEven ? 'md:justify-start' : 'md:justify-end'}
              `}
            >
              {/* Dot mapping to the line */}
              <div 
                className={`absolute left-0 md:left-1/2 -ml-[6px] md:-ml-[8px] w-4 h-4 md:w-5 md:h-5 rounded-full z-10 transition-colors duration-500
                  ${theme === 'sakura' ? 'bg-[#D13030] shadow-[0_0_10px_rgba(209,48,48,0.5)]' : 'bg-[#00FFFF] shadow-[0_0_15px_#00FFFF]'}
                `}
              />

              {/* Card Content */}
              <div 
                className={`pl-12 md:pl-0 w-full md:w-[40%] flex flex-col
                  ${isEven ? 'md:pr-16 md:text-right md:items-end' : 'md:pl-16 md:text-left md:items-start'}
                `}
              >
                <span className={`text-xs md:text-sm font-bold tracking-widest uppercase mb-1
                  ${theme === 'sakura' ? 'font-sans text-[#D13030]' : 'font-mono text-[var(--accent-secondary)]'}
                `}>
                  [{item.year}]
                </span>
                
                <h3 className={`text-xl md:text-2xl font-bold uppercase mb-2
                  ${theme === 'sakura' ? 'font-serif text-black' : 'font-mono text-white'}
                `}>
                  {item.title}
                </h3>
                
                <span className={`text-xs uppercase tracking-widest mb-4 opacity-70
                  ${theme === 'sakura' ? 'font-sans text-gray-600' : 'font-mono text-[var(--text-secondary)]'}
                `}>
                  {item.entity}
                </span>
                
                <p className={`text-sm md:text-base leading-relaxed p-4 md:p-6 backdrop-blur-md rounded border transition-colors shadow-xl
                  ${theme === 'sakura' 
                    ? 'bg-white/60 border-white text-gray-800' 
                    : 'bg-black/60 border-white/10 text-gray-300'}
                `}>
                  {item.description}
                </p>
              </div>

            </motion.div>
          );
        })}

      </div>
    </section>
  );
}
