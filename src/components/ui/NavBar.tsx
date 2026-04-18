"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const navItems = [
  { name: "Inicio", targetId: "inicio" },
  { name: "Sobre Mí", targetId: "sobre-mi" },
  { name: "Habilidades", targetId: "habilidades" },
  { name: "Proyectos", targetId: "proyectos" },
  { name: "Trayectoria", targetId: "trayectoria" },
];

export function NavBar() {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState("inicio");
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < 16) return;
      lastScrollTime.current = now;

      // Find the current section
      const sections = navItems.map(item => document.getElementById(item.targetId));
      let current = activeSection;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec) {
          const rect = sec.getBoundingClientRect();
          // If the section's top is past the middle of the screen
          if (rect.top <= window.innerHeight / 2.5) {
            current = navItems[i].targetId;
            break;
          }
        }
      }

      // Explicit check for footer/contacto since it's short
      const footer = document.getElementById("contacto");
      if (footer && footer.getBoundingClientRect().top <= window.innerHeight / 1.5) {
        current = "contacto";
      }

      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const handleNavClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-[100] border-b backdrop-blur-xl transition-colors duration-500
        ${theme === "sakura" ? "bg-white/40 border-[#1A1A1A]/10 text-[#1A1A1A]" : "bg-[#050505]/60 border-[var(--accent-primary)] text-[var(--text-primary)]"}
      `}
      style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="font-bold text-xl uppercase tracking-widest cursor-pointer" onClick={() => handleNavClick("inicio")}>
          <span className={theme === "sakura" ? "font-serif" : "font-mono text-glow-cyan"}>FR</span>
        </div>

        {/* LINKS DEMO */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div 
              key={item.name} 
              className="relative cursor-pointer uppercase tracking-widest text-xs font-bold py-2"
              onClick={() => handleNavClick(item.targetId)}
            >
              <span className={`transition-opacity ${activeSection === item.targetId ? 'opacity-100' : 'opacity-40 hover:opacity-80'} ${theme === 'sakura' ? 'font-sans' : 'font-mono'}`}>
                {item.name}
              </span>
              
              {activeSection === item.targetId && (
                <motion.div 
                  layoutId="active-indicator"
                  className={`absolute -bottom-[2px] left-0 right-0 h-[2px]
                    ${theme === 'sakura' ? 'bg-[#D13030]' : 'bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]'}
                  `}
                />
              )}
            </div>
          ))}
        </nav>

        {/* CONTACT BUTTON */}
        <div 
          className={`cursor-pointer px-4 py-2 uppercase tracking-widest text-xs font-bold border transition-colors
            ${theme === "sakura" 
              ? "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white" 
              : "border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black hover:shadow-[0_0_15px_var(--accent-primary)]"
            }
            ${activeSection === 'contacto' && theme === 'sakura' ? 'bg-[#1A1A1A] text-white' : ''}
            ${activeSection === 'contacto' && theme === 'neon' ? 'bg-[var(--accent-primary)] text-black' : ''}
          `}
          onClick={() => handleNavClick("contacto")}
        >
          [ Contactar ]
        </div>

      </div>
    </motion.header>
  );
}
