"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const navItems = [
  { name: "Inicio",      targetId: "inicio" },
  { name: "Sobre Mí",   targetId: "sobre-mi" },
  { name: "Habilidades", targetId: "habilidades" },
  { name: "Proyectos",   targetId: "proyectos" },
  { name: "Trayectoria", targetId: "trayectoria" },
  { name: "Contacto",    targetId: "contacto" },
];

export function NavBar() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("inicio");
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollTime = useRef(0);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < 16) return;
      lastScrollTime.current = now;

      if (mobileOpen) setMobileOpen(false);

      const sections = navItems.map(item => document.getElementById(item.targetId));
      let current = activeSection;
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.getBoundingClientRect().top <= window.innerHeight / 2.5) {
          current = navItems[i].targetId;
          break;
        }
      }
      if (current !== activeSection) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, mobileOpen]);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    const section = document.getElementById(id);
    if (section) window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
  };

  const isDay = theme === "sakura";

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-[200] border-b backdrop-blur-xl transition-colors duration-500
          ${isDay ? "bg-white/40 border-[#1A1A1A]/10 text-[#1A1A1A]" : "bg-[#050505]/70 border-[var(--accent-primary)]/40 text-[var(--text-primary)]"}`}
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">

          {/* Logo */}
          <div
            className={`font-black text-lg sm:text-xl uppercase tracking-widest cursor-pointer select-none
              ${isDay ? "font-serif" : "font-mono text-glow-cyan"}`}
            onClick={() => handleNavClick("inicio")}
          >
            {isDay ? "FR" : "<FR/>"}
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.slice(0, 5).map((item) => (
              <div
                key={item.name}
                className="relative cursor-pointer uppercase tracking-widest text-xs font-bold py-2"
                onClick={() => handleNavClick(item.targetId)}
              >
                <span className={`transition-opacity
                  ${activeSection === item.targetId ? "opacity-100" : "opacity-40 hover:opacity-75"}
                  ${isDay ? "font-sans" : "font-mono"}`}>
                  {item.name}
                </span>
                {activeSection === item.targetId && (
                  <motion.div
                    layoutId="active-indicator"
                    className={`absolute -bottom-[2px] left-0 right-0 h-[2px]
                      ${isDay ? "bg-[#D13030]" : "bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]"}`}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div
            className={`hidden md:flex cursor-pointer px-4 py-2 uppercase tracking-widest text-xs font-bold border transition-all duration-200
              ${isDay
                ? "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                : "border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black hover:shadow-[0_0_12px_var(--accent-primary)]"}
              ${activeSection === "contacto" && isDay ? "bg-[#1A1A1A] text-white" : ""}
              ${activeSection === "contacto" && !isDay ? "bg-[var(--accent-primary)] text-black" : ""}`}
            onClick={() => handleNavClick("contacto")}
          >
            [ Contactar ]
          </div>

          {/* Mobile hamburger */}
          <button
            className={`flex md:hidden flex-col justify-center items-center w-9 h-9 gap-[5px] rounded
              ${isDay ? "text-[#1A1A1A]" : "text-[var(--accent-primary)]"}`}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menú"
          >
            <span className={`block w-6 h-[2px] rounded transition-all duration-300 bg-current
              ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-6 h-[2px] rounded transition-all duration-300 bg-current
              ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-[2px] rounded transition-all duration-300 bg-current
              ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-14 left-0 right-0 z-[199] flex flex-col py-4 border-b backdrop-blur-xl
              ${isDay ? "bg-white/90 border-[#1A1A1A]/10" : "bg-[#050505]/95 border-[var(--accent-primary)]/30"}`}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.targetId)}
                className={`px-6 py-3 text-left uppercase tracking-widest text-sm font-bold transition-colors
                  ${activeSection === item.targetId
                    ? isDay ? "text-[#D13030]" : "text-[var(--accent-primary)]"
                    : isDay ? "text-[#1A1A1A]/60" : "text-[var(--text-secondary)]"}`}
              >
                {isDay ? item.name : `> ${item.name}`}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
