"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useAi } from "@/components/providers/AiProvider";
import { motion } from "framer-motion";
import { Mail, Terminal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"></path>
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon>
  </svg>
);

const CvIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);


export function FooterSection() {
  const { theme } = useTheme();
  const { openAi, isOpen } = useAi();
  const footerRef = useRef<HTMLElement>(null);
  const [hasTriggeredAi, setHasTriggeredAi] = useState(false);

  // Form Simulation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredAi && !isOpen) {
          openAi("La simulación ha llegado a su fin. ¿Iniciamos una conexión real?");
          setHasTriggeredAi(true);
        }
      },
      { root: null, threshold: 0.5 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggeredAi, isOpen, openAi]);

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate server action / sending
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 2000);
  };

  return (
    <footer id="contact" ref={footerRef} className="relative w-full pt-32 pb-0 px-6 mt-32 z-10">
      {/* Gradient fade-in from page to footer — replaces hard border */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, transparent, ${theme === 'sakura' ? 'rgba(255,245,245,0.5)' : 'rgba(5,5,5,0.6)'})`,
        }}
      />
      {/* Top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[1px] ${theme === 'sakura' ? 'bg-gradient-to-r from-transparent via-[#D13030]/30 to-transparent'
          : 'bg-gradient-to-r from-transparent via-[var(--accent-primary)]/40 to-transparent'
        }`} />
      {/* SVG filter strictly for the fluid reveal */}
      <svg className="fixed h-0 w-0 pointer-events-none">
        <defs>
          <filter id="ink-reveal-footer" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">

        {/* LEFT COLUMN: Narrative & Socials */}
        <div className={`flex flex-col text-center md:text-left
          ${theme === "sakura" ? "font-serif text-black" : "font-mono text-white"}
        `}>
          <motion.h2
            initial={theme === 'sakura' ? { clipPath: "inset(100% 0 0 0)", filter: "url(#ink-reveal-footer)" } : { clipPath: "inset(100% 0 0 0)" }}
            whileInView={theme === 'sakura' ? { clipPath: "inset(0% 0 0 0)", filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))" } : { clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none"
          >
            Inicio de<br />
            <span className={theme === 'sakura' ? 'text-[#D13030]' : 'text-[var(--accent-primary)] text-glow-cyan'}>Enlace</span>
          </motion.h2>
          <p className={`text-base md:text-lg mb-10 max-w-md mx-auto md:mx-0 opacity-80
            ${theme === 'sakura' ? 'font-sans text-gray-700' : 'font-mono text-gray-300'}
          `}>
            Despliegue operativo listo. Sistemas iniciados y a la espera de nuevos parámetros de misión.
            Contáctame para iniciar colaboración o ingeniería conjunta.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            <motion.a
              whileHover={{ y: -5 }}
              href="https://github.com/Yukiseip" target="_blank" rel="noopener noreferrer"
              aria-label="GitHub de Francisco"
              className={`p-4 rounded-full border transition-all duration-300
                ${theme === "sakura"
                  ? "bg-white border-black text-black hover:bg-black hover:text-white"
                  : "bg-black border-[var(--text-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_var(--accent-primary)]"}
              `}
            >
              <GithubIcon />
            </motion.a>
            <motion.a
              whileHover={{ y: -5 }}
              href="https://www.linkedin.com/in/francisco-cr-50ba66401/" target="_blank" rel="noopener noreferrer"
              aria-label="LinkedIn de Francisco"
              className={`p-4 rounded-full border transition-all duration-300
                ${theme === "sakura"
                  ? "bg-white border-black text-black hover:bg-[#D13030] hover:border-[#D13030] hover:text-white"
                  : "bg-black border-[var(--text-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_var(--accent-primary)]"}
              `}
            >
              <LinkedinIcon />
            </motion.a>
            <motion.a
              whileHover={{ y: -5 }}
              href="https://www.youtube.com/@Yukiseif" target="_blank" rel="noopener noreferrer"
              aria-label="YouTube de Francisco"
              className={`p-4 rounded-full border transition-all duration-300
                ${theme === "sakura"
                  ? "bg-white border-black text-black hover:bg-red-600 hover:border-red-600 hover:text-white"
                  : "bg-black border-[var(--text-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_var(--accent-primary)]"}
              `}
            >
              <YoutubeIcon />
            </motion.a>
            <motion.a
              whileHover={{ y: -5 }}
              href="/cv.pdf" download="CV"
              title="Descargar CV"
              className={`p-4 rounded-full border transition-all duration-300
                ${theme === "sakura"
                  ? "bg-white border-black text-black hover:bg-black hover:text-white"
                  : "bg-black border-[var(--text-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_var(--accent-primary)]"}
              `}
            >
              <CvIcon />
            </motion.a>
          </div>
        </div>

        {/* RIGHT COLUMN: Minimalist Form */}
        <div className="flex flex-col w-full max-w-md mx-auto md:ml-auto">
          <form onSubmit={handleSimulateSubmit} className="flex flex-col gap-6">

            {/* Name Input */}
            <div className="relative group">
              <input
                type="text"
                required
                placeholder="NOMBRE_IDENTIFICADOR"
                className={`w-full p-4 border-b-2 bg-transparent outline-none transition-all duration-300 tracking-widest text-sm
                   ${theme === 'sakura'
                    ? 'border-gray-300 text-black font-sans placeholder:text-gray-400 focus:border-black'
                    : 'border-[var(--text-secondary)]/50 text-[var(--text-primary)] font-mono placeholder:text-gray-600 focus:border-[var(--accent-primary)] focus:shadow-[0_2px_10px_var(--accent-primary)]'}
                 `}
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                required
                placeholder="DIR_PROTOCOLO_MAIL"
                className={`w-full p-4 border-b-2 bg-transparent outline-none transition-all duration-300 tracking-widest text-sm
                   ${theme === 'sakura'
                    ? 'border-gray-300 text-black font-sans placeholder:text-gray-400 focus:border-black'
                    : 'border-[var(--text-secondary)]/50 text-[var(--text-primary)] font-mono placeholder:text-gray-600 focus:border-[var(--accent-primary)] focus:shadow-[0_2px_10px_var(--accent-primary)]'}
                 `}
              />
            </div>

            {/* Message Input */}
            <div className="relative group">
              <textarea
                rows={3}
                required
                placeholder="TEXT_DATA_PAYLOAD..."
                className={`w-full p-4 border-b-2 bg-transparent outline-none transition-all duration-300 tracking-widest text-sm resize-none
                   ${theme === 'sakura'
                    ? 'border-gray-300 text-black font-sans placeholder:text-gray-400 focus:border-black'
                    : 'border-[var(--text-secondary)]/50 text-[var(--text-primary)] font-mono placeholder:text-gray-600 focus:border-[var(--accent-primary)] focus:shadow-[0_2px_10px_var(--accent-primary)]'}
                 `}
              />
            </div>

            {/* Terminal Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSent}
              className={`relative mt-4 px-6 py-4 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-300
                 ${theme === 'sakura'
                  ? 'bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-300 font-sans'
                  : 'bg-black border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black font-mono disabled:border-gray-600 disabled:text-gray-600 disabled:hover:bg-black'}
               `}
            >
              {!isSubmitting && !isSent && (
                <>
                  <Terminal size={16} /> [ TRANSMITIR_DATA ]
                </>
              )}
              {isSubmitting && (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">_</span> RUTEO_EN_PROGRESO...
                </span>
              )}
              {isSent && (
                <span className="flex items-center gap-2">
                  <Mail size={16} /> TRANSMISIÓN EXITOSA.
                </span>
              )}
            </button>

          </form>
        </div>

      </div>

      {/* ── Footer bottom bar ── */}
      <div className={`relative mt-20 pt-8 pb-10 flex flex-col md:flex-row items-center justify-between gap-4
        ${theme === 'sakura' ? 'border-t border-black/[0.06]' : 'border-t border-white/[0.06]'}`}>

        <span className={`text-[10px] uppercase tracking-[0.3em] opacity-30
          ${theme === 'sakura' ? 'font-sans text-black' : 'font-mono text-white'}`}>
          © {new Date().getFullYear()} Francisco Calvo · México
        </span>

        <div className={`flex items-center gap-3 text-[9px] uppercase tracking-widest opacity-25
          ${theme === 'sakura' ? 'font-sans text-black' : 'font-mono text-white'}`}>
          <span>All Systems Normal</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>v2.0</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>{theme === 'sakura' ? '🌸 Sakura' : '⚡ Neon'}</span>
        </div>
      </div>
    </footer>
  );
}
