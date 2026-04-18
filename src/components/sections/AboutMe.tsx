"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useAi } from "@/components/providers/AiProvider";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { DialogueNovel } from "@/components/ui/DialogueNovel";

export function AboutMe() {
  const { theme } = useTheme();
  const { openAi, isOpen: isDialogueOpen } = useAi();
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);

  const playBip = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (err) {}
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });
  const yPhoto = useTransform(smoothProgress, [0, 1], [50, -50]);
  const yText  = useTransform(smoothProgress, [0, 1], [-30, 30]);

  const isNight = theme === 'neon';

  return (
    <section id="about" ref={ref} className="relative flex flex-col justify-center min-h-screen py-24 px-4 sm:px-6 bg-transparent z-10 w-full overflow-hidden">

      <svg className="fixed h-0 w-0 pointer-events-none">
        <defs>
          <filter id="ink-reveal" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="w-full max-w-[1200px] mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

        {/* ── Column 1: Text ── */}
        <motion.div style={{ y: yText }} className="flex flex-col justify-center relative z-20">
          {/* overflow-hidden is required for clipPath reveal to work */}
          <div className="overflow-hidden">
            <motion.h2
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              whileInView={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-60px" }}
              className={`text-5xl sm:text-6xl md:text-8xl font-light mb-8 tracking-tighter leading-tight
                ${theme === "sakura" ? "font-serif text-[#1A1A1A]" : "font-mono text-[var(--accent-primary)] text-glow-cyan"}`}
            >
              Sobre Mí
            </motion.h2>
          </div>

          <div className={`space-y-6 text-xl md:text-2xl font-light leading-relaxed max-w-[45ch]
            ${theme === "sakura" ? "font-sans text-gray-700" : "font-mono text-[var(--text-primary)] opacity-90"}`}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {theme === "sakura"
                ? "Encuentro el equilibrio entre la estética y la funcionalidad. Mi enfoque en el desarrollo emula la calma del agua: fluidez, adaptabilidad y una persistencia inquebrantable."
                : "Desarrollador full-stack optimizado para entornos de alta presión. Arquitecturas robustas, código limpio y despliegues eficientes."}
            </motion.p>
          </div>
        </motion.div>

        {/* ── Column 2: Photo + CTA ── */}
        <div className="flex flex-col xl:flex-row gap-12 items-center xl:items-start relative z-30">

          <motion.div style={{ y: yPhoto }} className="flex flex-col items-start gap-6 shrink-0">

            {/* ── Photo container — breathing glow, no border ── */}
            <div
              className="relative w-72 h-[450px] md:w-80 md:h-[550px] cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Breathing glow — neon */}
              {isNight && (
                <motion.div
                  className="absolute -inset-3 rounded-sm pointer-events-none z-0"
                  animate={{ opacity: [0.25, 0.6, 0.25] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ boxShadow: "0 0 50px 12px var(--accent-primary)", borderRadius: "2px" }}
                />
              )}

              {/* Breathing glow — sakura */}
              {!isNight && (
                <motion.div
                  className="absolute -inset-2 rounded-sm pointer-events-none z-0"
                  animate={{ opacity: [0.15, 0.45, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ boxShadow: "0 0 40px 8px rgba(209,48,48,0.4)" }}
                />
              )}

              {/* Falling petals — always mounted, opacity-controlled so repeat:Infinity survives hover toggle */}
              {!isNight && (
                <div
                  className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-sm"
                  style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s ease' }}
                >
                  {/* 12 petals with hand-tuned x positions covering the full width */}
                  {[
                    { x: '6%',  dur: 2.0, delay: 0.0  },
                    { x: '18%', dur: 2.4, delay: 0.3  },
                    { x: '30%', dur: 1.9, delay: 0.7  },
                    { x: '42%', dur: 2.7, delay: 0.1  },
                    { x: '54%', dur: 2.1, delay: 0.5  },
                    { x: '66%', dur: 2.5, delay: 0.9  },
                    { x: '76%', dur: 1.8, delay: 0.2  },
                    { x: '86%', dur: 2.3, delay: 0.6  },
                    { x: '12%', dur: 2.8, delay: 1.1  },
                    { x: '36%', dur: 2.0, delay: 1.4  },
                    { x: '60%', dur: 2.6, delay: 0.8  },
                    { x: '82%', dur: 1.7, delay: 1.2  },
                  ].map(({ x, dur, delay }, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-sm select-none"
                      style={{ left: x }}
                      animate={{
                        y: ['-5%', '115%'],
                        opacity: [0, 1, 1, 0],
                        rotate: [0, 180 + i * 22],
                      }}
                      transition={{
                        duration: dur,
                        delay,
                        repeat: Infinity,
                        repeatDelay: 0.4,
                        ease: 'easeIn',
                      }}
                    >
                      🌸
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Photo with continuous levitation */}
              <motion.div
                className="w-full h-full relative z-10 overflow-hidden rounded-sm"
                animate={{ y: [0, -10, 0], scale: isHovered ? 1.04 : 1 }}
                transition={{
                  y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.5, ease: "easeOut" },
                }}
                style={{ boxShadow: isNight
                  ? "0 30px 60px rgba(0,0,0,0.7)"
                  : "0 30px 60px rgba(0,0,0,0.25)"
                }}
              >
                <Image
                  src="/imagenes/imagen-personal.jpeg"
                  alt="Retrato"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 288px, 320px"
                />
              </motion.div>
            </div>

            {/* ── CTA Button — redesigned ── */}
            <div
              className="relative w-72 md:w-80 flex justify-center"
              onMouseEnter={() => { setIsCtaHovered(true); playBip(); }}
              onMouseLeave={() => setIsCtaHovered(false)}
            >
              {isNight ? (
                /* ── NIGHT: Hexagonal cyber button ── */
                <motion.button
                  onClick={() => openAi()}
                  whileTap={{ scale: 0.92 }}
                  className="relative w-full group overflow-hidden border border-[var(--accent-primary)] bg-black/80 py-4 px-6 font-mono text-[var(--accent-primary)] text-xs tracking-widest uppercase"
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                >
                  {/* Scan pulse */}
                  <motion.span
                    className="absolute inset-0 bg-[var(--accent-primary)]/10 pointer-events-none"
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* Left + right beams */}
                  <motion.span
                    className="absolute left-0 top-0 w-[2px] h-full bg-[var(--accent-primary)] pointer-events-none"
                    animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                  />
                  <motion.span
                    className="absolute right-0 top-0 w-[2px] h-full bg-[var(--accent-primary)] pointer-events-none"
                    animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: 1.1 }}
                  />

                  <span className="relative z-10 flex flex-col items-center gap-0.5">
                    <span className="text-[var(--accent-primary)] text-base font-bold tracking-tight">⬡ YUKISEI</span>
                    <span className="opacity-70 text-[10px] tracking-[0.2em]">[ Conéctate con la IA ]</span>
                  </span>

                  {/* Corner brackets */}
                  <span className="absolute top-1 left-2 text-[var(--accent-primary)]/50 text-[10px] font-mono">◤</span>
                  <span className="absolute bottom-1 right-2 text-[var(--accent-primary)]/50 text-[10px] font-mono">◢</span>
                </motion.button>
              ) : (
                /* ── DAY: Elegant pill button ── */
                <motion.button
                  onClick={() => openAi()}
                  whileTap={{ scale: 0.94 }}
                  className="relative w-full group overflow-hidden rounded-full border border-black/20 bg-white py-4 px-6 font-serif text-[#1A1A1A] text-xs tracking-widest uppercase shadow-[0_8px_32px_rgba(209,48,48,0.15)]"
                >
                  {/* Shimmer */}
                  <motion.span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(209,48,48,0.07), transparent)" }}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <span className="relative z-10 flex flex-col items-center gap-1">
                    <span className="text-[#D13030] text-base">✦ Yukisei</span>
                    <span className="opacity-60 text-[10px] tracking-[0.18em]">Averigua más sobre Francisco</span>
                  </span>
                </motion.button>
              )}

              {/* Sticker on hover */}
              <AnimatePresence>
                {isCtaHovered && (
                  <motion.div
                    initial={{ scale: 0, rotate: 20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 10, opacity: 1 }}
                    exit={{ scale: 0, rotate: 20, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="absolute -top-12 -right-12 w-24 h-24 pointer-events-none drop-shadow-xl z-[60]"
                  >
                    <Image src="/imagenes/Boton_IA.png" alt="IA Sticker" fill className="object-contain" sizes="96px" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Metrics */}
          <div className="flex flex-row xl:flex-col gap-10 mt-10 xl:mt-10 xl:pl-6 shrink-0 z-30">
            {[
              { num: "+10", title: "Proyectos" },
              { num: "3",   title: "Años de Experiencia" },
              { num: "IA",  title: "Soluciones" }
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col items-center xl:items-start"
              >
                <span className={`text-6xl md:text-7xl font-thin leading-none tracking-tight
                  ${theme === 'sakura' ? 'font-serif text-[#1A1A1A]' : 'font-mono text-[var(--accent-primary)] text-glow-cyan'}`}>
                  {metric.num}
                </span>
                <span className={`text-xs md:text-sm uppercase tracking-widest mt-2
                  ${theme === 'sakura' ? 'font-sans text-gray-500 font-medium' : 'font-mono text-gray-400'}`}>
                  {metric.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
