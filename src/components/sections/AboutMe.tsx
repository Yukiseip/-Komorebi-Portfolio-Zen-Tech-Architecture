"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useAi } from "@/components/providers/AiProvider";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SettledPetals } from "@/components/ui/PetalEffects";

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITY: Animated counting number
───────────────────────────────────────────────────────────────────────────── */
function CountUp({
  target,
  prefix = "",
  isText = false,
  duration = 1.6,
}: {
  target: number | string;
  prefix?: string;
  isText?: boolean;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Skip entirely for text labels — no observer needed
    if (isText || !ref.current) return;
    const end = Number(target);
    const steps = 50;
    const stepDuration = (duration * 1000) / steps;
    let timer: ReturnType<typeof setInterval>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          timer = setInterval(() => {
            start += end / steps;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, stepDuration);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => { observer.disconnect(); clearInterval(timer); };
  }, [target, duration, isText]);

  if (isText) return <span>{target as string}</span>;
  return <span ref={ref}>{prefix}{count}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATIC HEADING — "Sobre Mí" (day) / "About Me" (night)
   No interval, no AnimatePresence — zero JS timer cost.
───────────────────────────────────────────────────────────────────────────── */
function SectionHeading({ isNight }: { isNight: boolean }) {
  const text = isNight ? "About Me" : "Sobre Mí";
  return (
    <div className="mb-8">
      <span
        className={`block font-light tracking-tighter leading-tight
          text-5xl sm:text-6xl md:text-7xl
          ${isNight
            ? "font-mono text-[var(--accent-primary)] text-glow-cyan"
            : "font-serif text-[#1A1A1A]"
          }`}
      >
        {text}
      </span>
    </div>
  );
}



/* ─────────────────────────────────────────────────────────────────────────────
   PROFILE CARD — 3D Tilt + Dynamic Glow
   isHovered prop removed (petal overlay deleted).
───────────────────────────────────────────────────────────────────────────── */
function ProfileCard({
  isNight,
  setIsHovered,
}: {
  isNight: boolean;
  setIsHovered: (v: boolean) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const shadowX = useMotionValue(0);
  const shadowY = useMotionValue(0);

  const springRotX = useSpring(rotateX, { stiffness: 200, damping: 30 });
  const springRotY = useSpring(rotateY, { stiffness: 200, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateX.set(-dy * 12);
    rotateY.set(dx * 12);
    shadowX.set(-dx * 20);
    shadowY.set(-dy * 20);
  }, [rotateX, rotateY, shadowX, shadowY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    shadowX.set(0);
    shadowY.set(0);
    setIsHovered(false);
  }, [rotateX, rotateY, shadowX, shadowY, setIsHovered]);

  const dynamicShadow = useTransform(
    [shadowX, shadowY],
    ([x, y]) => {
      const nx = x as number;
      const ny = y as number;
      return isNight
        ? `${nx}px ${ny}px 60px rgba(0,255,255,0.35), ${nx * 0.5}px ${ny * 0.5}px 30px rgba(255,0,255,0.2)`
        : `${nx}px ${ny}px 50px rgba(209,48,48,0.25), ${nx * 0.5}px ${ny * 0.5}px 25px rgba(255,183,197,0.3)`;
    }
  );

  return (
    <motion.div
      ref={cardRef}
      className="relative w-72 h-[450px] md:w-80 md:h-[550px] cursor-pointer"
      style={{
        perspective: 1000,
        rotateX: springRotX,
        rotateY: springRotY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileInView={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Dynamic glow shadow — follows 3D tilt */}
      <motion.div
        className="absolute inset-0 rounded-sm pointer-events-none z-0"
        style={{ boxShadow: dynamicShadow }}
      />

      {/* ── Thin static border ── */}
      <div
        className="absolute inset-0 rounded-sm pointer-events-none z-20"
        style={{
          border: isNight
            ? "1px solid rgba(0,255,255,0.25)"
            : "1px solid rgba(255,183,197,0.5)",
        }}
      />

      {/* ── Photo (static, no levitation) ── */}
      <div className="w-full h-full relative z-10 overflow-hidden rounded-sm">
        <Image
          src="/imagenes/imagen-personal.jpeg"
          alt="Francisco Calvo Rodriguez"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 288px, 320px"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isNight
              ? "linear-gradient(135deg, rgba(0,255,255,0.04) 0%, transparent 60%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)",
          }}
        />
      </div>

    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAT CARD — Rounded circle, CountUp, spring hover lift
───────────────────────────────────────────────────────────────────────────── */
function StatCard({
  num,
  title,
  index,
  isNight,
}: {
  num: string;
  title: string;
  index: number;
  isNight: boolean;
}) {
  const isText = isNaN(Number(num.replace("+", "")));
  const numericVal = isText ? num : Number(num.replace("+", ""));
  const prefix = num.startsWith("+") ? "+" : "";

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: false, amount: 0.3 }}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center cursor-default select-none"
    >
      <div
        className="relative flex flex-col items-center justify-center rounded-full"
        style={{
          width: "136px",
          height: "136px",
          background: isNight ? "rgba(0,255,255,0.05)" : "rgba(255,255,255,0.65)",
          backdropFilter: "blur(10px)",
          border: isNight ? "1px solid rgba(0,255,255,0.2)" : "1px solid rgba(255,183,197,0.45)",
          boxShadow: isNight
            ? "0 8px 32px rgba(0,255,255,0.1), inset 0 1px 0 rgba(0,255,255,0.08)"
            : "0 8px 32px rgba(209,48,48,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <span
          className={`block text-4xl md:text-5xl font-thin leading-none tracking-tight
            ${isNight ? "font-mono text-[var(--accent-primary)] text-glow-cyan" : "font-serif text-[#1A1A1A]"}`}
        >
          <CountUp target={isText ? num : numericVal} prefix={prefix} isText={isText} duration={1.6} />
        </span>
        <span
          className={`block text-[9px] uppercase tracking-widest mt-2 text-center px-2
            ${isNight ? "font-mono text-[var(--text-secondary)]" : "font-sans text-gray-500 font-medium"}`}
        >
          {title}
        </span>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   YUKISEI BUTTON — spring scale + lift on hover, tap feedback
───────────────────────────────────────────────────────────────────────────── */
function YukiseiButton({
  onClick,
  isNight,
  onHoverStart,
  onHoverEnd,
}: {
  onClick: () => void;
  isNight: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <motion.button
      onClick={() => onClick()}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className="relative w-full overflow-hidden rounded-full cursor-pointer"
      style={{
        background: isNight ? "rgba(0,255,255,0.06)" : "rgba(255,255,255,0.55)",
        backdropFilter: "blur(12px)",
        border: isNight ? "1px solid rgba(0,255,255,0.3)" : "1px solid rgba(255,255,255,0.8)",
        boxShadow: isNight
          ? "inset 0 1px 0 rgba(0,255,255,0.15)"
          : "inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
      aria-label={isNight ? "Conectar con Yukisei IA" : "Averigua más sobre Francisco con Yukisei"}
    >
      <span className="relative z-10 flex flex-col items-center gap-1 py-4 px-6">
        <span
          className={`text-base font-semibold tracking-tight ${isNight ? "font-mono text-[#00FFFF]" : "font-serif text-[#D13030]"
            }`}
          style={isNight ? { textShadow: "0 0 12px rgba(0,255,255,0.6)" } : {}}
        >
          {isNight ? "⬡ YUKISEI IA" : "✦ Yukisei IA"}
        </span>
        <span
          className={`text-[10px] tracking-[0.18em] opacity-65 ${isNight ? "font-mono text-[var(--text-secondary)]" : "font-serif text-gray-600"
            }`}
        >
          {isNight ? "[ Conéctate con la IA ]" : "Si necesitas saber algo, haz clic en mí."}
        </span>
      </span>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────────────────────────── */
export function AboutMe() {
  const { theme } = useTheme();
  const { openAi } = useAi();
  const sectionRef = useRef<HTMLElement>(null);
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [showSettledPetals, setShowSettledPetals] = useState(false);

  const isNight = theme === "neon";

  // Settled-petal bridge from Hero
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowSettledPetals(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Lazy-init AudioContext once per component mount — avoid creating a new
  // AudioContext (and OS audio session) on every hover event.
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBip = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume().catch(() => { });
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch { /* silent */ }
  }, []);

  // Close AudioContext on unmount to release OS audio session
  useEffect(() => {
    return () => { audioCtxRef.current?.close().catch(() => { }); };
  }, []);

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });
  const yText = useTransform(smoothProgress, [0, 1], [-20, 20]);
  const yPhoto = useTransform(smoothProgress, [0, 1], [30, -30]);

  const STATS = [
    { num: "+10", title: "Proyectos" },
    { num: "3", title: "Años de Exp." },
    { num: "IA", title: "Soluciones" },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex flex-col justify-center min-h-screen py-24 px-4 sm:px-6 z-10 w-full overflow-hidden"
    >
      {/* SVG filter defs */}
      <svg className="fixed h-0 w-0 pointer-events-none" aria-hidden>
        <defs>
          <filter id="ink-reveal" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Settled petal bridge */}
      <SettledPetals visible={showSettledPetals} />

      {/* Ambient orbs */}
      {!isNight && (
        <motion.div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -z-0"
          style={{ background: "radial-gradient(circle, rgba(255,183,197,0.12) 0%, transparent 70%)", filter: "blur(60px)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isNight && (
        <motion.div
          className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full pointer-events-none -z-0"
          style={{ background: "radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* ── 3-column grid ─────────────────────────────────────────────────── */}
      <div className="w-full max-w-[1300px] mx-auto relative grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 md:gap-16 xl:gap-24 items-center z-10">

        {/* ════ COLUMN 1 — TEXT ════ */}
        <motion.div
          style={{ y: yText }}
          suppressHydrationWarning
          className="flex flex-col justify-center relative"
        >
          {/* Static heading — no timer, no AnimatePresence */}
          <SectionHeading isNight={isNight} />

          {/* Decorative rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            style={{ transformOrigin: "left" }}
            className={`h-px w-16 mb-8 ${isNight ? "bg-[var(--accent-primary)]" : "bg-[#D13030]/40"}`}
          />

          {/* Body paragraphs */}
          <div className={`space-y-5 max-w-[44ch] ${isNight ? "font-mono" : "font-sans"}`}>
            {[
              isNight
                ? "Desarrollador full-stack optimizado para entornos de alta presión. Arquitecturas robustas, código limpio y despliegues eficientes."
                : "Encuentro el equilibrio entre la estética y la funcionalidad. Mi enfoque en el desarrollo emula la calma del agua: fluidez, adaptabilidad y una persistencia inquebrantable.",
              isNight
                ? "Especializado en soluciones IA, sistemas distribuidos y experiencias de usuario que desafían convenciones."
                : "Diseño sistemas que respiran — donde cada línea de código es intencional y cada interfaz invita a quedarse.",
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: false, amount: 0.3 }}
                className={`text-lg md:text-xl font-light leading-relaxed
                  ${isNight ? "text-[var(--text-primary)] opacity-85" : "text-gray-700"}`}
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Skill tags */}
          <motion.div
            className="flex flex-wrap gap-2 mt-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.3 }}
          >
            {["Full-Stack", "IA / ML", "UX Design", "Cloud"].map((tag) => (
              <span
                key={tag}
                className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full
                  ${isNight
                    ? "font-mono text-[var(--accent-primary)]/70 border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5"
                    : "font-sans text-gray-500 border border-gray-200 bg-white/60"
                  }`}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ════ COLUMN 2 — PHOTO + CTA ════ */}
        <motion.div
          style={{ y: yPhoto }}
          suppressHydrationWarning
          className="flex flex-col items-center gap-6 shrink-0"
        >
          {/* Profile card — 3D tilt + dynamic shadow only */}
          <ProfileCard
            isNight={isNight}
            setIsHovered={setIsPhotoHovered}
          />

          {/* Name caption — ONLY below photo, no badge above */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: false, amount: 0.3 }}
            className={`text-[11px] uppercase tracking-[0.3em] text-center
              ${isNight ? "font-mono text-[var(--text-secondary)]" : "font-sans text-gray-400"}`}
          >
            Francisco Calvo Rodríguez
          </motion.p>

          {/* CTA — Glassmorphism + Magnetic */}
          <div className="relative w-72 md:w-80 flex justify-center">
            <YukiseiButton
              onClick={openAi}
              isNight={isNight}
              onHoverStart={() => { setIsCtaHovered(true); playBip(); }}
              onHoverEnd={() => setIsCtaHovered(false)}
            />

            {/* Yukisei sticker on hover */}
            <AnimatePresence>
              {isCtaHovered && (
                <motion.div
                  initial={{ scale: 0, rotate: 20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 10, opacity: 1 }}
                  exit={{ scale: 0, rotate: 20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute -top-12 -right-12 w-24 h-24 pointer-events-none drop-shadow-xl z-[60]"
                >
                  <Image
                    src="/imagenes/Boton_IA.png"
                    alt="IA Sticker"
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ════ COLUMN 3 — STATS ════ */}
        <div className="flex flex-row md:flex-col gap-6 md:gap-8 items-center md:items-start shrink-0 z-30">
          {STATS.map((stat, i) => (
            <StatCard key={i} num={stat.num} title={stat.title} index={i} isNight={isNight} />
          ))}
        </div>

      </div>
    </section>
  );
}
