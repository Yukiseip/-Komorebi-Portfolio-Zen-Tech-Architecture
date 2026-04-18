"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, Variants, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const GREETINGS = ["¡Hola!", "Hello!", "こんにちは!", "你好!", "Привет!", "Bonjour!"];

function RotatingGreeting() {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 md:h-12 flex items-center justify-center mb-2">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className={`text-xl md:text-2xl font-bold uppercase tracking-widest
            ${theme === "sakura" ? "font-serif text-[#D13030]" : "font-mono text-[var(--accent-primary)] text-glow-cyan"}
          `}
        >
          {GREETINGS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function HeroSection() {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  
  // Scrollytelling Setup
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });

  // Calculate parallax and opacity tied to scroll
  const y = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);

  // Framer Motion variants for Sakura presentation
  const sakuraVariants: Variants = {
    hidden: { opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
    visible: { 
      opacity: 1, 
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      transition: { duration: 1.5, ease: "easeOut" }
    }
  };

  // Glitch effect logic for Neon presentation (CSS handled + motion)
  const neonVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.section 
      id="home"
      ref={ref}
      style={{ opacity }}
      className="relative flex items-center justify-center h-screen w-full overflow-hidden"
    >
      <motion.div style={{ y }} className="flex flex-col items-center">
        {theme === "sakura" ? (
          // SAKURA THEME PRESENTATION
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={sakuraVariants}
            className="text-center"
          >
            <RotatingGreeting />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[var(--text-primary)] tracking-tight mb-4">
              Ingeniero en Sistemas
            </h1>
            <p className="text-xl md:text-2xl text-[var(--accent-primary)] font-light italic">
              Código con propósito. Diseño con alma.
            </p>
          </motion.div>
        ) : (
          // NEON THEME PRESENTATION
          <motion.div
            initial="hidden"
            animate="visible"
            variants={neonVariants}
            className="text-center group"
          >
            <RotatingGreeting />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono text-glow-cyan text-[calc(var(--accent-primary))] font-bold uppercase tracking-widest relative">
              <span className="relative inline-block before:content-['SYSTEM_ENGINEER'] before:absolute before:inset-0 before:text-[var(--accent-secondary)] before:z-[-1] before:animate-pulse">
                SYSTEM_ENGINEER
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl font-mono text-[var(--text-secondary)] text-glow-magenta opacity-80 group-hover:opacity-100 transition-opacity">
              &gt; INIT_PROTOCOL: TRUE
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        <span className={`text-sm mb-2 ${theme === 'sakura' ? 'font-serif' : 'font-mono uppercase'}`}>
          {theme === "sakura" ? "Descubrir" : "Scroll_Down"}
        </span>
        <div className={`w-[1px] h-12 ${theme === 'sakura' ? 'bg-[var(--text-secondary)]' : 'bg-[var(--accent-primary)] text-glow-cyan'}`} />
      </motion.div>
    </motion.section>
  );
}
