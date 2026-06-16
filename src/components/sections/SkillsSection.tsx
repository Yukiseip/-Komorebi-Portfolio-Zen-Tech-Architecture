"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useRef, useCallback } from "react";

// ── Simple Icons (official logos) ─────────────────────────
import {
  SiPython,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiNextdotjs,
  SiGit,
  SiGithub,
  SiMongodb,
  SiCplusplus,
  SiTailwindcss,
  SiVercel,
  SiCss,
  SiHtml5,
} from "react-icons/si";

import { FaJava } from "react-icons/fa";

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────

interface Tech {
  id: string;
  label: string;
  bg: string;
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}

const TECHS: Tech[] = [
  { id: "typescript", label: "TypeScript", bg: "#3178C6", color: "#3178C6", Icon: SiTypescript },
  { id: "javascript", label: "JavaScript", bg: "#F7DF1E", color: "#F7DF1E", Icon: SiJavascript },
  { id: "cplusplus", label: "C++", bg: "#00599C", color: "#00599C", Icon: SiCplusplus },
  { id: "nextjs", label: "Next.js", bg: "#FFFFFF", color: "#FFFFFF", Icon: SiNextdotjs },
  { id: "tailwindcss", label: "Tailwind CSS", bg: "#06B6D4", color: "#06B6D4", Icon: SiTailwindcss },
  { id: "mongodb", label: "MongoDB", bg: "#47A248", color: "#47A248", Icon: SiMongodb },
  { id: "github", label: "GitHub", bg: "#FFFFFF", color: "#FFFFFF", Icon: SiGithub },
  { id: "vercel", label: "Vercel", bg: "#FFFFFF", color: "#FFFFFF", Icon: SiVercel },
  { id: "java", label: "Java", bg: "#007396", color: "#007396", Icon: FaJava },
  { id: "nodejs", label: "Node.js", bg: "#339933", color: "#339933", Icon: SiNodedotjs },
  { id: "css3", label: "CSS3", bg: "#1572B6", color: "#1572B6", Icon: SiCss },
  { id: "html5", label: "HTML5", bg: "#E34F26", color: "#E34F26", Icon: SiHtml5 },
  { id: "react", label: "React", bg: "#61DAFB", color: "#61DAFB", Icon: SiReact },
  { id: "python", label: "Python", bg: "#3776AB", color: "#3776AB", Icon: SiPython },
  { id: "git", label: "Git", bg: "#F05032", color: "#F05032", Icon: SiGit },
];

// ─────────────────────────────────────────────────────────
// MATH
// ─────────────────────────────────────────────────────────

/** Evenly distribute N points on a unit sphere via Fibonacci spiral */
function fibonacciSphere(n: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  const goldenAngle = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    pts.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return pts;
}

// ─── Proper trackball matrix helpers ──────────────────────

/** Multiply two 3×3 matrices stored as flat 9-element arrays (row-major) */
function mulMat3(a: number[], b: number[]): number[] {
  return [
    a[0]*b[0]+a[1]*b[3]+a[2]*b[6], a[0]*b[1]+a[1]*b[4]+a[2]*b[7], a[0]*b[2]+a[1]*b[5]+a[2]*b[8],
    a[3]*b[0]+a[4]*b[3]+a[5]*b[6], a[3]*b[1]+a[4]*b[4]+a[5]*b[7], a[3]*b[2]+a[4]*b[5]+a[5]*b[8],
    a[6]*b[0]+a[7]*b[3]+a[8]*b[6], a[6]*b[1]+a[7]*b[4]+a[8]*b[7], a[6]*b[2]+a[7]*b[5]+a[8]*b[8],
  ];
}

/** Apply a 3×3 matrix to a 3D point */
function applyMat3(m: number[], x: number, y: number, z: number): [number, number, number] {
  return [
    m[0]*x + m[1]*y + m[2]*z,
    m[3]*x + m[4]*y + m[5]*z,
    m[6]*x + m[7]*y + m[8]*z,
  ];
}

/** Rotation matrix around world X axis (vertical tilt) */
function rotXMat(a: number): number[] {
  const c = Math.cos(a), s = Math.sin(a);
  return [1, 0, 0,  0, c, -s,  0, s, c];
}

/** Rotation matrix around world Y axis (horizontal spin) */
function rotYMat(a: number): number[] {
  const c = Math.cos(a), s = Math.sin(a);
  return [c, 0, s,  0, 1, 0,  -s, 0, c];
}

/** Re-orthonormalize a 3×3 rotation matrix to prevent floating-point drift */
function orthonormalize(m: number[]): number[] {
  // Gram-Schmidt on column vectors
  let x0=m[0], x1=m[3], x2=m[6];
  let y0=m[1], y1=m[4], y2=m[7];
  let z0=m[2], z1=m[5], z2=m[8];

  const xLen = Math.sqrt(x0*x0+x1*x1+x2*x2);
  x0/=xLen; x1/=xLen; x2/=xLen;

  const dot = x0*y0+x1*y1+x2*y2;
  y0-=dot*x0; y1-=dot*x1; y2-=dot*x2;
  const yLen = Math.sqrt(y0*y0+y1*y1+y2*y2);
  y0/=yLen; y1/=yLen; y2/=yLen;

  z0=x1*y2-x2*y1; z1=x2*y0-x0*y2; z2=x0*y1-x1*y0;

  return [x0,y0,z0, x1,y1,z1, x2,y2,z2];
}

const BASE_POINTS = fibonacciSphere(TECHS.length);

// ─────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────

export function SkillsSection() {
  const { theme } = useTheme();
  const isNeon = theme === "neon";

  const isNeonRef = useRef(isNeon);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animRef = useRef<number>(0);
  // Trackball rotation stored as a 3×3 matrix (flat, row-major). Identity = no rotation.
  // Initial slight tilt on X so sphere isn't viewed perfectly flat-on.
  const matRef = useRef<number[]>(mulMat3(rotXMat(0.28), [1,0,0,0,1,0,0,0,1]));
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ w: 600, h: 600 });
  const hoveredRef = useRef<string | null>(null);
  // Angular velocity per frame: ax (X-tilt), ay (Y-spin)
  const velRef = useRef({ ax: 0, ay: 0.0025 });
  // Frame counter for periodic re-orthonormalization
  const frameRef = useRef(0);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { isNeonRef.current = isNeon; }, [isNeon]);
  useEffect(() => { setMounted(true); }, []);

  // ── Measure container ────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      sizeRef.current = { w: el.clientWidth, h: el.clientHeight };
      const c = canvasRef.current;
      if (c) { c.width = el.clientWidth; c.height = el.clientHeight; }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── rAF animation loop ───────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    const tick = () => {
      const { w, h } = sizeRef.current;
      const RADIUS = Math.min(w, h) * 0.40;
      const cx = w / 2;
      const cy = h / 2;
      const neon = isNeonRef.current;

      // ── Trackball physics ─────────────────────────────
      if (!isDragging.current) {
        // Smoothly decay velocity back toward default Y auto-spin, X = 0
        velRef.current.ay += (0.0025 - velRef.current.ay) * 0.05;
        velRef.current.ax += (0 - velRef.current.ax) * 0.05;

        // Apply this frame's angular velocity as an incremental rotation
        // Premultiplying keeps rotations in WORLD space → always intuitive
        const delta = mulMat3(rotYMat(velRef.current.ay), rotXMat(velRef.current.ax));
        matRef.current = mulMat3(delta, matRef.current);
      }

      // Re-orthonormalize every 120 frames to prevent floating-point drift
      frameRef.current++;
      if (frameRef.current % 120 === 0) {
        matRef.current = orthonormalize(matRef.current);
      }

      // ── Canvas wireframe ──────────────────────────
      const canvas = canvasRef.current;
      if (canvas && canvas.width > 0) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, w, h);

          // Soft internal glow gradient (radial)
          if (neon) {
            const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, RADIUS);
            grd.addColorStop(0, "rgba(99, 102, 241, 0.15)"); // Indigo soft inner glow
            grd.addColorStop(0.5, "rgba(99, 102, 241, 0.06)");
            grd.addColorStop(1, "rgba(99, 102, 241, 0)");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, RADIUS);
            grd.addColorStop(0, "rgba(209, 48, 48, 0.12)"); // Sakura theme soft inner glow
            grd.addColorStop(0.5, "rgba(209, 48, 48, 0.04)");
            grd.addColorStop(1, "rgba(209, 48, 48, 0)");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
            ctx.fill();
          }

          // Let's draw the true 3D wireframe mesh
          const latLinesCount = 9;
          const lonLinesCount = 12;
          const pointsPerCircle = 36;

          // Drawing latitude circles
          for (let j = 0; j < latLinesCount; j++) {
            const latFraction = (j / (latLinesCount - 1)) * 2 - 1; // -1 to 1
            const lat = latFraction * 0.85; // cap at poles
            const y = lat;
            const r = Math.sqrt(1 - y * y);

            let prevX = 0;
            let prevY = 0;
            let prevZ = 0;
            let prevValid = false;

            for (let k = 0; k <= pointsPerCircle; k++) {
              const theta = (k / pointsPerCircle) * Math.PI * 2;
              const x = Math.cos(theta) * r;
              const z = Math.sin(theta) * r;

              // Rotate via trackball matrix
              const [rx, ry, rz] = applyMat3(matRef.current, x, y, z);
              const px = cx + rx * RADIUS;
              const py = cy - ry * RADIUS;

              if (prevValid) {
                const avgZ = (rz + prevZ) / 2;
                const segmentDepth = (avgZ + 1) / 2; // 0 to 1
                const opacity = neon
                  ? 0.04 + segmentDepth * 0.16
                  : 0.06 + segmentDepth * 0.20;

                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(px, py);
                ctx.strokeStyle = neon
                  ? `rgba(99, 102, 241, ${opacity})`
                  : `rgba(209, 48, 48, ${opacity})`;
                ctx.lineWidth = neon ? 0.95 : 0.8;
                ctx.stroke();
              }

              prevX = px;
              prevY = py;
              prevZ = rz;
              prevValid = true;
            }
          }

          // Drawing longitude circles
          for (let j = 0; j < lonLinesCount; j++) {
            const phi = (j / lonLinesCount) * Math.PI; // 0 to PI

            let prevX = 0;
            let prevY = 0;
            let prevZ = 0;
            let prevValid = false;

            for (let k = 0; k <= pointsPerCircle; k++) {
              const theta = (k / pointsPerCircle) * Math.PI * 2;
              const x = Math.cos(theta) * Math.cos(phi);
              const y = Math.sin(theta);
              const z = Math.cos(theta) * Math.sin(phi);

              // Rotate via trackball matrix
              const [rx, ry, rz] = applyMat3(matRef.current, x, y, z);
              const px = cx + rx * RADIUS;
              const py = cy - ry * RADIUS;

              if (prevValid) {
                const avgZ = (rz + prevZ) / 2;
                const segmentDepth = (avgZ + 1) / 2;
                const opacity = neon
                  ? 0.04 + segmentDepth * 0.16
                  : 0.06 + segmentDepth * 0.20;

                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(px, py);
                ctx.strokeStyle = neon
                  ? `rgba(99, 102, 241, ${opacity})`
                  : `rgba(209, 48, 48, ${opacity})`;
                ctx.lineWidth = neon ? 0.95 : 0.8;
                ctx.stroke();
              }

              prevX = px;
              prevY = py;
              prevZ = rz;
              prevValid = true;
            }
          }

          // Draw a subtle outer boundary circle to anchor the sphere volume
          ctx.strokeStyle = neon ? "rgba(99, 102, 241, 0.18)" : "rgba(209, 48, 48, 0.24)";
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(cx, cy, RADIUS, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ── Icon positions ────────────────────────────
      TECHS.forEach((tech, i) => {
        const [bx, by, bz] = BASE_POINTS[i];
        const [rx, ry, rz] = applyMat3(matRef.current, bx, by, bz);

        const projX = cx + rx * RADIUS;
        const projY = cy - ry * RADIUS;
        const depth = (rz + 1) / 2;
        const scale = 0.42 + depth * 0.78;
        const opacity = 0.18 + depth * 0.82;
        const zIndex = Math.round(depth * 100);
        const isH = hoveredRef.current === tech.id;

        const el = iconRefs.current[i];
        if (!el) return;

        el.style.left = `${projX}px`;
        el.style.top = `${projY}px`;
        el.style.opacity = isH ? "1" : `${Math.max(opacity, 0.18)}`;
        el.style.zIndex = isH ? "200" : `${zIndex}`;
        el.style.transform = `translate(-50%, -50%) scale(${isH ? Math.min(scale * 1.45, 1.38) : scale})`;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [mounted]);

  // ── Interaction handlers ─────────────────────────────
  const SENSITIVITY = 0.0045;

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x; // positive = moved right
    const dy = e.clientY - lastMouse.current.y; // positive = moved down

    // Horizontal drag → spin around world Y (dx > 0 = spin right)
    const ay = dx * SENSITIVITY;
    // Vertical drag → tilt around world X (dy > 0 = tilt down, surface moves down)
    const ax = dy * SENSITIVITY;

    // Premultiply so rotations always happen in WORLD space
    const delta = mulMat3(rotYMat(ay), rotXMat(ax));
    matRef.current = mulMat3(delta, matRef.current);

    // Store as velocity for momentum after release
    velRef.current.ay = ay;
    velRef.current.ax = ax;

    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const stopDrag = useCallback(() => { isDragging.current = false; }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - lastMouse.current.x;
    const dy = e.touches[0].clientY - lastMouse.current.y;

    const ay = dx * SENSITIVITY;
    const ax = dy * SENSITIVITY;

    const delta = mulMat3(rotYMat(ay), rotXMat(ax));
    matRef.current = mulMat3(delta, matRef.current);

    velRef.current.ay = ay;
    velRef.current.ax = ax;

    lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleHoverEnter = useCallback((id: string) => {
    hoveredRef.current = id;
    setHoveredId(id);
  }, []);

  const handleHoverLeave = useCallback(() => {
    hoveredRef.current = null;
    setHoveredId(null);
  }, []);

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────
  return (
    <section
      id="skills"
      className="relative min-h-[100vh] py-24 px-2 md:px-6 flex flex-col justify-center items-center w-full z-10 overflow-hidden"
      style={{
        backgroundImage: isNeon
          ? "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)"
          : "radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full text-center mb-10 z-20 pointer-events-none"
      >
        <p className={`text-[11px] tracking-[0.35em] uppercase mb-3 ${isNeon ? "font-mono text-[var(--accent-primary)]" : "font-sans text-[#D13030]"}`}>
          TECH STACK
        </p>

        <h2 className={`text-4xl md:text-5xl font-bold ${isNeon ? "font-mono" : "font-serif"}`}>
          <span className={isNeon ? "text-white" : "text-[#1A1A1A]"}>My </span>
          <span className={isNeon ? "text-[var(--accent-primary)] italic" : "text-[#D13030] italic"}>Skills</span>
        </h2>

        <p className={`mt-3 text-xs tracking-widest uppercase opacity-45 italic ${isNeon ? "font-mono text-[var(--text-primary)]" : "font-sans text-black"}`}>
          {isNeon
            ? "[ ARRASTRA PARA ROTAR · HOVER PARA EXPLORAR ]"
            : "Arrastra para rotar · pasa el cursor para explorar"}
        </p>
      </motion.div>

      {/* ── Sphere container ────────────────────────── */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[700px] h-[480px] md:h-[600px] mx-auto z-20 cursor-grab active:cursor-grabbing select-none touch-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Wireframe canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s" }}
        />

        {/* Tech icon badges */}
        {TECHS.map((tech, i) => {
          const isH = hoveredId === tech.id;
          // Dynamically override white brand icons for readability on light themes
          const iconColor = (tech.color === "#FFFFFF" && !isNeon) ? "#1A1A1A" : tech.color;

          return (
            <div
              key={tech.id}
              ref={(el) => { iconRefs.current[i] = el; }}
              className="absolute pointer-events-auto"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                willChange: "transform, opacity, left, top",
                opacity: 0,
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => handleHoverEnter(tech.id)}
              onMouseLeave={handleHoverLeave}
            >
              {/* Direct Tech Icon Wrapper (no background box card) */}
              <div className="flex flex-col items-center justify-center select-none cursor-pointer">
                {/* Glow behind the icon (visible on hover) */}
                <div
                  className="absolute w-12 h-12 rounded-full blur-md pointer-events-none -z-10 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle, ${tech.bg}55 0%, transparent 70%)`,
                    transform: "scale(1.5)",
                    opacity: isH ? 1 : 0,
                  }}
                />

                {/* SVG Icon */}
                <div
                  className="flex items-center justify-center transition-transform duration-300"
                  style={{
                    filter: isH
                      ? `drop-shadow(0 0 10px ${iconColor}cc) drop-shadow(0 0 20px ${tech.bg}55)`
                      : "none",
                    transform: isH ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  {mounted && <tech.Icon size={38} color={iconColor} />}
                </div>

                {/* Text Label */}
                <div className="mt-2.5 h-6 flex items-center justify-center">
                  {isH ? (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase text-white shadow-lg whitespace-nowrap"
                      style={{
                        background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
                      }}
                    >
                      {tech.label}
                    </span>
                  ) : (
                    <span
                      className="text-[9px] font-medium tracking-[0.2em] uppercase whitespace-nowrap transition-opacity duration-300"
                      style={{
                        color: isNeon ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
                      }}
                    >
                      {tech.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ──────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className={`mt-6 text-[11px] tracking-widest uppercase opacity-30 ${isNeon ? "font-mono text-white" : "font-sans text-black"}`}
      >
        {TECHS.length} tecnologías · 1 ecosistema
      </motion.p>
    </section>
  );
}
