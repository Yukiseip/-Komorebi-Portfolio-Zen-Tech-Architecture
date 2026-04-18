"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue, AnimatePresence, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    class Petal {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVy: number;
      wobbleSpeed: number;
      wobble: number;
      size: number;
      rotation: number;
      vRot: number;
      baseVRot: number;

      // 20% slower
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseVy = 0.4 + Math.random() * 1.2;
        this.vy = this.baseVy;
        this.vx = 0;
        this.wobbleSpeed = 0.01 + Math.random() * 0.02;
        this.wobble = Math.random() * Math.PI * 2;
        this.size = 8 + Math.random() * 8;
        this.rotation = Math.random() * 360;
        this.baseVRot = (Math.random() - 0.5) * 2;
        this.vRot = this.baseVRot;
      }

      update(mouseX: number, mouseY: number, isClick: boolean, scrollVelocity: number) {
        this.wobble += this.wobbleSpeed;

        // Base floating movement
        let targetVx = Math.sin(this.wobble) * 1.5;
        let targetVy = this.baseVy;

        // Interaction (Wind / Repulsion)
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (isClick && dist < 250) {
          // Shockwave
          const force = (250 - dist) / 250;
          this.vx += (dx / dist) * force * 15;
          this.vy += (dy / dist) * force * 15;
          this.vRot += (Math.random() - 0.5) * 40;
        } else if (dist < 100) {
          // Repulsion field
          const force = (100 - dist) / 100;
          this.vx += (dx / dist) * force * 0.8;
          this.vy += (dy / dist) * force * 0.8;
          this.vRot += (Math.random() - 0.5) * 5;
        }

        // Apply velocities (adding scrollVelocity to visually match parallax)
        this.x += this.vx;
        this.y += this.vy - scrollVelocity * 0.4;
        this.rotation += this.vRot;

        // Apply linear damping per user request (ease linear feel)
        this.vx += (targetVx - this.vx) * 0.1;
        this.vy += (targetVy - this.vy) * 0.1;
        this.vRot += (this.baseVRot - this.vRot) * 0.1;

        // Screen wrapping (always top of viewport relative)
        if (this.y > height + 50) {
          this.y = -50;
          this.x = Math.random() * width;
        } else if (this.y < -50) {
          this.y = height + 50;
        }

        if (this.x > width + 50) this.x = -50;
        else if (this.x < -50) this.x = width + 50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);

        ctx.fillStyle = "#FFB7C5";
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#FFB7C5";
        ctx.globalAlpha = 0.8;
        
        ctx.beginPath();
        // Draw a simple petal shape
        ctx.moveTo(0, -this.size/2);
        ctx.bezierCurveTo(this.size/2, -this.size/2, this.size/2, this.size/2, 0, this.size/2);
        ctx.bezierCurveTo(-this.size/2, this.size/2, -this.size/2, -this.size/2, 0, -this.size/2);
        ctx.fill();

        ctx.restore();
      }
    }

    // Memoized instantiation logic
    let petals: Petal[] = [];
    if (!canvas.getAttribute("data-initialized")) {
       petals = Array.from({ length: 60 }, () => new Petal());
       (canvas as any).petals = petals;
       canvas.setAttribute("data-initialized", "true");
    } else {
       petals = (canvas as any).petals;
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let isClick = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onClick = () => {
      isClick = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    let animationFrameId: number;
    let lastScrollY = window.scrollY;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Calculate scroll velocity for parallax effect natively in canvas
      const currentScrollY = window.scrollY;
      const scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      petals.forEach((p) => {
        p.update(mouseX, mouseY, isClick, scrollVelocity);
        p.draw(ctx);
      });

      isClick = false;
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" style={{ willChange: "transform" }} />;
}

function NeonGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#050505] opacity-80">
      {/* Perspective wrapper */}
      <div className="absolute inset-0 perspective-[1000px] flex items-center justify-center">
        {/* Animated Grid */}
        <motion.div
          className="absolute bottom-[-50%] w-[200%] h-[150%] border-t-[1px] border-[#00FFFF]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #00FFFF 1px, transparent 1px),
              linear-gradient(to bottom, #00FFFF 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transformOrigin: "top",
            rotateX: "70deg",
            boxShadow: "inset 0 0 100px #FF00FF",
            willChange: "transform, background-position",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "0px 50px"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      
      {/* Horizon Fade */}
      <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#050505] via-[#050505] to-transparent z-10" />
    </div>
  );
}

export function AmbientBackground() {
  const { theme } = useTheme();
  
  // Parallax Setup (kept for NeonGrid)
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 1000, damping: 100 });
  const yParallax = useTransform(smoothScrollY, [0, 5000], [0, 500]); // 10% slower

  // Spotlight Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const spotlightColor = theme === "sakura" 
    ? "rgba(255, 255, 255, 0.4)" 
    : "rgba(0, 255, 255, 0.15)";
  
  const backgroundSpotlight = useMotionTemplate`radial-gradient(circle 600px at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.02] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <motion.div 
        className="fixed inset-0 z-40 pointer-events-none mix-blend-screen"
        style={{ background: backgroundSpotlight }}
      />

      <AnimatePresence mode="wait">
        {theme === "sakura" ? (
          <motion.div 
            key="sakura"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[-1]"
          >
            <SakuraCanvas />
          </motion.div>
        ) : (
          <motion.div 
            key="neon"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[-1]"
            style={{ y: yParallax }}
          >
            <NeonGrid />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
