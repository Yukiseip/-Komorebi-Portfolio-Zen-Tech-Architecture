"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  useMotionTemplate,
} from "framer-motion";
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────

interface GraphNode {
  id: string;
  label: string;
  type: "master" | "child";
  x: number;
  y: number;
  /** Short description shown in tooltip */
  desc?: string;
}

interface GraphEdge { source: string; target: string; }

const NODES: GraphNode[] = [
  // ── Master hubs ──────────────────────────────────────
  { id: "front",   label: "Frontend",          type: "master", x: 18, y: 30,
    desc: "Interfaces de alto impacto visual y rendimiento." },
  { id: "back",    label: "Backend",            type: "master", x: 82, y: 30,
    desc: "APIs robustas, arquitecturas por capas y lógica de servidor." },
  { id: "db",      label: "Bases de Datos",     type: "master", x: 82, y: 72,
    desc: "Persistencia de datos relacional y no relacional." },
  { id: "ai",      label: "Data & IA",          type: "master", x: 18, y: 72,
    desc: "ML, NLP, LLMs, RAG y pipelines de datos." },
  { id: "devops",  label: "DevOps",             type: "master", x: 50, y: 14,
    desc: "Infraestructura, CI/CD y entornos de producción." },

  // ── Frontend children ────────────────────────────────
  { id: "react",   label: "React / Next.js",    type: "child",  x: 4,  y: 14,  desc: "SPA, SSR, App Router" },
  { id: "ts",      label: "TypeScript",         type: "child",  x: 4,  y: 48,  desc: "Tipado estricto, DX premium" },
  { id: "html",    label: "HTML / CSS",         type: "child",  x: 8,  y: 58,  desc: "Semántica y estilo preciso" },
  { id: "tw",      label: "Tailwind CSS",       type: "child",  x: 3,  y: 69,  desc: "Utility-first, diseño rápido" },
  { id: "fm",      label: "Framer Motion",      type: "child",  x: 10, y: 24,  desc: "Animaciones declarativas" },
  { id: "a11y",    label: "ARIA / A11y",        type: "child",  x: 28, y: 8,   desc: "Accesibilidad universal" },

  // ── Backend children ─────────────────────────────────
  { id: "node",    label: "Node.js / Express",  type: "child",  x: 96, y: 14,  desc: "APIs REST de alta velocidad" },
  { id: "python",  label: "Python",             type: "child",  x: 94, y: 45,  desc: "FastAPI, Django y scripts" },
  { id: "graphql", label: "REST / GraphQL",     type: "child",  x: 96, y: 57,  desc: "Contratos de API modernos" },
  { id: "java",    label: "Java / C#",          type: "child",  x: 73, y: 14,  desc: "Ecosistemas empresariales" },
  { id: "cpp",     label: "C++",                type: "child",  x: 96, y: 70,  desc: "Rendimiento de bajo nivel" },

  // ── Database children ────────────────────────────────
  { id: "pg",      label: "PostgreSQL",         type: "child",  x: 96, y: 83,  desc: "SQL avanzado, transacciones" },
  { id: "mongo",   label: "MongoDB",            type: "child",  x: 73, y: 88,  desc: "Documentos, flexibilidad" },
  { id: "nosql",   label: "SQL / NoSQL",        type: "child",  x: 68, y: 78,  desc: "Patrones de persistencia" },

  // ── AI / Data children ──────────────────────────────
  { id: "tf",      label: "TensorFlow / SKL",   type: "child",  x: 4,  y: 83,  desc: "Scikit-learn, deep learning" },
  { id: "llm",     label: "LLM / RAG",          type: "child",  x: 8,  y: 93,  desc: "Gemini, GPT, Groq + retrieval" },
  { id: "nlp",     label: "NLP",                type: "child",  x: 25, y: 92,  desc: "Procesamiento de lenguaje" },
  { id: "pandas",  label: "Pandas / NumPy",     type: "child",  x: 28, y: 80,  desc: "Análisis y transformación de datos" },
  { id: "etl",     label: "ETL Pipelines",      type: "child",  x: 35, y: 90,  desc: "Ingestión, limpieza, carga" },

  // ── DevOps children ──────────────────────────────────
  { id: "docker",  label: "Docker / Compose",   type: "child",  x: 40, y: 4,   desc: "Contenedores y orquestación local" },
  { id: "cicd",    label: "CI/CD Actions",      type: "child",  x: 60, y: 4,   desc: "GitHub Actions, automatización" },
  { id: "git",     label: "Git / GitHub",       type: "child",  x: 50, y: 26,  desc: "Control de versiones" },
  { id: "vercel",  label: "Vercel / Nginx",     type: "child",  x: 50, y: 36,  desc: "Deploy, caché y reverso" },
];

const EDGES: GraphEdge[] = [
  // Front connections
  { source: "front",  target: "react" },
  { source: "front",  target: "ts" },
  { source: "front",  target: "html" },
  { source: "front",  target: "tw" },
  { source: "front",  target: "fm" },
  { source: "front",  target: "a11y" },

  // Back connections
  { source: "back",   target: "node" },
  { source: "back",   target: "python" },
  { source: "back",   target: "graphql" },
  { source: "back",   target: "java" },
  { source: "back",   target: "cpp" },

  // DB connections
  { source: "db",     target: "pg" },
  { source: "db",     target: "mongo" },
  { source: "db",     target: "nosql" },

  // AI connections
  { source: "ai",     target: "tf" },
  { source: "ai",     target: "llm" },
  { source: "ai",     target: "nlp" },
  { source: "ai",     target: "pandas" },
  { source: "ai",     target: "etl" },

  // DevOps connections
  { source: "devops", target: "docker" },
  { source: "devops", target: "cicd" },
  { source: "devops", target: "git" },
  { source: "devops", target: "vercel" },

  // Cross connections (shared tech)
  { source: "back",   target: "python" },
  { source: "ai",     target: "python" },
  { source: "back",   target: "db" },
  { source: "devops", target: "git" },
  { source: "front",  target: "vercel" },
  { source: "back",   target: "docker" },
];

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────
export function SkillsSection() {
  const { theme } = useTheme();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Master node floating motion values
  const frontX = useMotionValue(0); const frontY = useMotionValue(0);
  const backX  = useMotionValue(0); const backY  = useMotionValue(0);
  const dbX    = useMotionValue(0); const dbY    = useMotionValue(0);
  const aiX    = useMotionValue(0); const aiY    = useMotionValue(0);
  const devX   = useMotionValue(0); const devY   = useMotionValue(0);
  const zero   = useMotionValue(0);

  useEffect(() => {
    const ctrls = [
      animate(frontX, [0,  12, -8,  0], { duration: 6.5, repeat: Infinity, ease: "easeInOut" }),
      animate(frontY, [0, -10, 14,  0], { duration: 7.0, repeat: Infinity, ease: "easeInOut" }),
      animate(backX,  [0,  -9, 13,  0], { duration: 7.5, repeat: Infinity, ease: "easeInOut" }),
      animate(backY,  [0,  13, -9,  0], { duration: 6.0, repeat: Infinity, ease: "easeInOut" }),
      animate(dbX,    [0,  10, -12, 0], { duration: 8.0, repeat: Infinity, ease: "easeInOut" }),
      animate(dbY,    [0, -12, 10,  0], { duration: 6.8, repeat: Infinity, ease: "easeInOut" }),
      animate(aiX,    [0,  -11, 9,  0], { duration: 7.2, repeat: Infinity, ease: "easeInOut" }),
      animate(aiY,    [0,  11, -13, 0], { duration: 5.8, repeat: Infinity, ease: "easeInOut" }),
      animate(devX,   [0,   8, -10, 0], { duration: 6.2, repeat: Infinity, ease: "easeInOut" }),
      animate(devY,   [0,  -8,  12, 0], { duration: 7.8, repeat: Infinity, ease: "easeInOut" }),
    ];
    return () => ctrls.forEach(c => c.stop());
  }, [frontX, frontY, backX, backY, dbX, dbY, aiX, aiY, devX, devY]);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const masterOffsets = useMemo(() => ({
    front:  { x: frontX,  y: frontY  },
    back:   { x: backX,   y: backY   },
    db:     { x: dbX,     y: dbY     },
    ai:     { x: aiX,     y: aiY     },
    devops: { x: devX,    y: devY    },
  }), [frontX, frontY, backX, backY, dbX, dbY, aiX, aiY, devX, devY]);

  const getOffset = useCallback(
    (id: string, type: string) =>
      type === "master" ? (masterOffsets as Record<string, { x: typeof zero; y: typeof zero }>)[id] ?? { x: zero, y: zero } : { x: zero, y: zero },
    [masterOffsets, zero]
  );

  const handleEnter = useCallback((id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredNode(id);
  }, []);

  const handleLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setHoveredNode(null), 350);
  }, []);

  const activeElements = useMemo(() => {
    const nodes = new Set<string>();
    const edges = new Set<string>();
    if (hoveredNode) {
      nodes.add(hoveredNode);
      EDGES.forEach((e, i) => {
        if (e.source === hoveredNode || e.target === hoveredNode) {
          nodes.add(e.source);
          nodes.add(e.target);
          edges.add(`${e.source}-${e.target}-${i}`);
        }
      });
    }
    return { nodes, edges };
  }, [hoveredNode]);

  const hoveredData = NODES.find(n => n.id === hoveredNode);

  // Color tokens
  const accent = theme === "sakura" ? "#D13030" : "var(--accent-primary)";
  const edgeColor =
    theme === "sakura" ? "rgba(209,48,48,0.5)" : "rgba(0,255,255,0.65)";

  return (
    <section
      id="skills"
      className="relative min-h-[100vh] py-32 px-2 md:px-6 flex flex-col justify-center items-center w-full z-10 overflow-hidden"
    >
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full text-center mb-4 z-20 pointer-events-none"
      >
        <h2
          className={`text-4xl md:text-5xl font-light tracking-widest uppercase
            ${theme === "sakura"
              ? "font-serif text-[#1A1A1A]"
              : "font-mono text-[var(--accent-primary)] text-glow-cyan"}`}
        >
          Ecosistema Tecnológico
        </h2>
        <p
          className={`mt-3 text-sm tracking-widest uppercase opacity-50
            ${theme === "sakura" ? "font-sans text-black" : "font-mono text-[var(--text-primary)]"}`}
        >
          {theme === "sakura"
            ? "Pasa el cursor sobre un área para explorar las tecnologías"
            : "[ HOVER PARA ESCANEAR SECTORES ]"}
        </p>
      </motion.div>

      {/* ── Tooltip / active node info ── */}
      <div className="h-14 mb-4 flex items-center justify-center z-30 pointer-events-none w-full">
        <AnimatePresence mode="wait">
          {hoveredData && (
            <motion.div
              key={hoveredData.id}
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`px-6 py-2 text-sm tracking-wide border backdrop-blur-md
                ${theme === "sakura"
                  ? "bg-white/90 border-[#D13030]/40 text-[#1A1A1A] font-sans rounded-md shadow"
                  : "bg-black/80 border-[var(--accent-primary)]/60 text-[var(--accent-primary)] font-mono shadow-[0_0_20px_rgba(0,255,255,0.2)]"}`}
            >
              <span className="font-bold">{hoveredData.label}</span>
              {hoveredData.desc && (
                <span className="opacity-60 ml-2">— {hoveredData.desc}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Graph canvas ── */}
      <div className="relative w-full max-w-[1400px] h-[560px] md:h-[680px] mx-auto z-20">

        {/* SVG edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <filter id="neon-glow-sk" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {EDGES.map((edge, index) => {
            const src = NODES.find(n => n.id === edge.source);
            const tgt = NODES.find(n => n.id === edge.target);
            if (!src || !tgt) return null;

            const key     = `${edge.source}-${edge.target}-${index}`;
            const isActive = activeElements.edges.has(key);
            const srcOff  = getOffset(src.id, src.type);
            const tgtOff  = getOffset(tgt.id, tgt.type);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const x1 = useMotionTemplate`calc(${src.x}% + ${srcOff.x}px)`;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y1 = useMotionTemplate`calc(${src.y}% + ${srcOff.y}px)`;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const x2 = useMotionTemplate`calc(${tgt.x}% + ${tgtOff.x}px)`;
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const y2 = useMotionTemplate`calc(${tgt.y}% + ${tgtOff.y}px)`;

            return (
              <motion.line
                key={key}
                x1={x1} y1={y1} x2={x2} y2={y2}
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0.06 }}
                transition={{ duration: 0.4 }}
                stroke={isActive ? edgeColor : (theme === "sakura" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.08)")}
                strokeWidth={isActive ? "1.5" : "0.8"}
                filter={isActive && theme === "neon" ? "url(#neon-glow-sk)" : "none"}
              />
            );
          })}
        </svg>

        {/* Node layer */}
        <div className="absolute inset-0 z-20">
          {NODES.map(node => {
            const isMaster   = node.type === "master";
            const isNodeHov  = hoveredNode === node.id;
            const isActive   = isMaster || activeElements.nodes.has(node.id);
            const nodeOff    = getOffset(node.id, node.type);

            return (
              <div
                key={node.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2
                  ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onMouseEnter={() => handleEnter(node.id)}
                onMouseLeave={handleLeave}
              >
                <motion.div
                  style={{ x: nodeOff.x, y: nodeOff.y, willChange: "transform" }}
                  initial={isMaster ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  animate={
                    isMaster
                      ? { scale: 1, opacity: 1, y: isNodeHov ? -4 : 0 }
                      : { scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }
                  }
                  transition={
                    isMaster
                      ? { duration: 0.25 }
                      : { type: "spring", stiffness: 280, damping: 22 }
                  }
                  className="flex flex-col items-center gap-1.5"
                >
                  {isMaster ? (
                    /* ── Master node ── */
                    <div className="flex flex-col items-center gap-2 group select-none">
                      {/* Pulsing dot */}
                      <div className="relative flex items-center justify-center">
                        {isNodeHov && (
                          <span
                            className="absolute w-8 h-8 rounded-full animate-ping opacity-30"
                            style={{ backgroundColor: accent }}
                          />
                        )}
                        <motion.div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: accent }}
                          animate={
                            isNodeHov
                              ? { scale: [1, 1.4, 1] }
                              : { scale: [1, 1.1, 1] }
                          }
                          transition={{ duration: isNodeHov ? 0.6 : 2, repeat: Infinity }}
                        />
                      </div>

                      {/* Label pill */}
                      <motion.div
                        className={`text-[11px] md:text-xs tracking-widest uppercase whitespace-nowrap px-3 py-1.5 border backdrop-blur-md font-bold
                          ${theme === "sakura"
                            ? isNodeHov
                              ? "bg-[#D13030] text-white border-[#D13030]"
                              : "bg-white/80 text-[#1A1A1A] border-black/15"
                            : isNodeHov
                              ? "bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_18px_var(--accent-primary)]"
                              : "bg-black/70 text-[var(--text-secondary)] border-[var(--text-secondary)]/30"
                          }`}
                        animate={
                          !isNodeHov && theme === "neon"
                            ? { boxShadow: ["0 0 0px transparent", "0 0 8px rgba(0,255,255,0.25)", "0 0 0px transparent"] }
                            : {}
                        }
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {node.label}
                      </motion.div>
                    </div>
                  ) : (
                    /* ── Child node ── */
                    <motion.div
                      whileHover={{ scale: 1.12 }}
                      className={`px-2.5 py-1 text-[10px] md:text-[11px] font-mono whitespace-nowrap border select-none
                        ${theme === "sakura"
                          ? isNodeHov
                            ? "bg-[#D13030] text-white border-[#D13030] shadow-md"
                            : "bg-white/95 text-[#1A1A1A] border-black/20 shadow-sm"
                          : isNodeHov
                            ? "bg-[var(--accent-primary)] text-black border-[var(--accent-primary)] shadow-[0_0_12px_var(--accent-primary)]"
                            : "bg-black/85 text-white border-[var(--accent-primary)]/40 shadow-[0_0_6px_rgba(0,255,255,0.1)]"
                        }`}
                    >
                      {node.label}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Skill count footer ── */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className={`mt-6 text-xs tracking-widest uppercase opacity-30
          ${theme === "sakura" ? "font-sans text-black" : "font-mono text-white"}`}
      >
        {NODES.filter(n => n.type === "child").length}+ tecnologías · 5 dominios · 1 ecosistema
      </motion.p>
    </section>
  );
}
