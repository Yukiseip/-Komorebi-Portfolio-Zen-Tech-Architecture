"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { useState, useCallback, useRef } from "react";

const navItems = [
  { name: "Inicio", targetId: "home" },
  { name: "Sobre Mí", targetId: "about" },
  { name: "Habilidades", targetId: "skills" },
  { name: "Proyectos", targetId: "projects" },
  { name: "Trayectoria", targetId: "experience" },
  { name: "Contacto", targetId: "contact" },
];

export function Sidebar() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 1000, damping: 100 });
  const lastScrollTime = useRef(0);

  const handleScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < 16) return; // Throttle to ~60FPS max for DOM queries
    lastScrollTime.current = now;

    const sections = navItems.map(item => document.getElementById(item.targetId));
    let current = activeSection;

    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = sections[i];
      if (sec) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2.5) {
          current = navItems[i].targetId;
          break;
        }
      }
    }

    const footer = document.getElementById("contact");
    if (footer && footer.getBoundingClientRect().top <= window.innerHeight / 1.5) {
      current = "contact";
    }

    if (current !== activeSection) {
      setActiveSection(current);
    }
  }, [activeSection]);

  // Framer Motion native optimized scroll listener
  useMotionValueEvent(scrollYProgress, "change", handleScroll);

  const handleNavClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <motion.aside
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className={`fixed top-0 left-0 bottom-0 z-[100] w-[180px] border-r backdrop-blur-xl hidden md:flex flex-col justify-between py-12 overflow-x-hidden
        ${theme === "sakura" ? "bg-white/40 border-[#1A1A1A]/10 text-[#1A1A1A]" : "bg-[#050505]/60 border-[var(--accent-primary)]/20 text-[var(--text-primary)]"}
      `}
      style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", contain: "paint" }}
    >
      {/* Time-lapse progress line (1px right border) */}
      <div className={`absolute top-0 right-0 w-[1px] h-full ${theme === "sakura" ? "bg-black/5" : "bg-[var(--accent-primary)]/10"}`}>
        <motion.div
          className={`absolute top-0 right-0 w-[1px] h-full origin-top ${theme === 'sakura' ? 'bg-[#D13030]' : 'bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]'}`}
          style={{ scaleY: smoothProgress, willChange: "transform" }}
        />
      </div>

      {/* TOP SECTION: IDENTIFIER */}
      <div className="px-5 cursor-pointer flex flex-col whitespace-nowrap" onClick={() => handleNavClick("home")}>
        <span className={`text-xl md:text-2xl uppercase tracking-widest leading-none ${theme === "sakura" ? "font-serif font-black" : "font-mono font-bold text-glow-cyan"}`}>
          SYS
        </span>
        <span className={`text-[9px] mt-2 opacity-50 uppercase tracking-widest ${theme === 'sakura' ? 'font-sans' : 'font-mono'}`}>
          .CORE
        </span>
      </div>

      {/* MIDDLE SECTION: LINKS */}
      <nav className="flex flex-col gap-8 w-full">
        {navItems.map((item) => (
          <div
            key={item.name}
            className="relative cursor-pointer uppercase tracking-widest text-[11px] font-bold py-2 w-full flex items-center group/item px-5"
            onClick={() => handleNavClick(item.targetId)}
          >
            {/* Nav label, permanently visible */}
            <span className={`transition-all duration-300 whitespace-nowrap pl-2 ${activeSection === item.targetId ? 'opacity-100' : 'opacity-50 group-hover/item:opacity-100'} ${theme === 'sakura' ? 'font-sans' : 'font-mono'}`}>
              {item.name}
            </span>

            {/* Active section indicator */}
            {activeSection === item.targetId && (
              <motion.div
                layoutId="sidebar-active"
                className={`absolute left-0 top-0 h-full w-[2px]
                  ${theme === 'sakura' ? 'bg-[#D13030]' : 'bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]'}
                `}
              />
            )}
          </div>
        ))}
      </nav>

      {/* BOTTOM SECTION: DECORATION */}
      <div className="px-5 whitespace-nowrap opacity-100">
        <span className={`text-[9px] uppercase tracking-widest opacity-40 block ${theme === 'sakura' ? 'font-sans text-black' : 'font-mono text-white'}`}>
          v1.0.0 // LIVE
        </span>
        <span className={`text-[9px] uppercase tracking-widest opacity-40 mt-1 block ${theme === 'sakura' ? 'font-sans text-black' : 'font-mono text-[var(--accent-primary)]'}`}>
          LAT: NaN // LONG: NaN
        </span>
      </div>

    </motion.aside>
  );
}
