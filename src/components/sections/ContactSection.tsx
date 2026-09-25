"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { motion } from "framer-motion";
import { Terminal, Send, CheckCircle2, User, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const CvIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export function ContactSection() {
  const { theme } = useTheme();
  const isNight = theme === "neon";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 5000);
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="relative w-full py-20 md:py-28 px-4 sm:px-8 z-10"
      suppressHydrationWarning
    >
      {/* ── Ambient Background Glow ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "min(680px, 90vw)",
          height: 380,
          borderRadius: "50%",
          background: isNight
            ? "radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(209,48,48,0.05) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-[1140px] mx-auto relative z-10">
        {/* ── Section Eyebrow (consistent with site architecture) ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold tracking-wider">
            <span
              className={
                isNight
                  ? "text-[var(--accent-primary)] font-bold text-base select-none"
                  : "text-[#D13030] font-bold text-base select-none"
              }
            >
              &gt;
            </span>
            <span className={isNight ? "text-white" : "text-[#1A1A1A]"}>
              contact_protocol.sh
            </span>
            <span
              className={`text-xs font-normal ${
                isNight ? "text-[var(--accent-primary)] opacity-80" : "text-[#D13030] opacity-85"
              }`}
            >
              --status=active --handshake=ready
            </span>
          </div>
        </motion.div>

        {/* ── Main Two-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ════ LEFT COLUMN: Info, Identity & Socials ════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col"
          >
            {/* Live Status indicator */}
            <div className="inline-flex items-center gap-2.5 mb-5 self-start">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span
                className={`text-[11px] font-mono uppercase tracking-widest ${
                  isNight ? "text-emerald-400" : "text-emerald-700 font-semibold"
                }`}
              >
                Canal de enlace activo
              </span>
            </div>

            {/* Title */}
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.08] mb-5 ${
                isNight ? "font-mono text-white" : "font-serif text-neutral-900"
              }`}
            >
              Inicio de<br />
              <span
                className={
                  isNight
                    ? "text-[var(--accent-primary)] text-glow-cyan"
                    : "text-[#D13030] italic font-serif"
                }
              >
                Enlace
              </span>
            </h2>

            {/* Description */}
            <p
              className={`text-sm sm:text-base leading-relaxed mb-8 ${
                isNight
                  ? "font-mono text-neutral-300"
                  : "font-sans text-neutral-600"
              }`}
            >
              Despliegue operativo listo. Sistemas iniciados y a la espera de nuevos parámetros de misión.
              Contáctame para colaboraciones en desarrollo de software, soluciones con IA o arquitectura de sistemas.
            </p>

            {/* Metadata Badges */}
            <div className="flex flex-col gap-2.5 mb-8">
              <div
                className={`flex items-center gap-3 text-xs py-2 px-3 rounded-lg w-fit ${
                  isNight
                    ? "bg-white/[0.04] border border-white/[0.08] font-mono text-neutral-300"
                    : "bg-black/[0.03] border border-black/[0.06] font-sans text-neutral-700"
                }`}
              >
                <span className="opacity-60">📍 Ubicación:</span>
                <span className="font-semibold">México</span>
              </div>
              <div
                className={`flex items-center gap-3 text-xs py-2 px-3 rounded-lg w-fit ${
                  isNight
                    ? "bg-white/[0.04] border border-white/[0.08] font-mono text-neutral-300"
                    : "bg-black/[0.03] border border-black/[0.06] font-sans text-neutral-700"
                }`}
              >
                <span className="opacity-60">⚡ Disponibilidad:</span>
                <span className="font-semibold">Proyectos & Consultoría</span>
              </div>
            </div>

            {/* Social links row */}
            <div>
              <p
                className={`text-[11px] uppercase tracking-wider mb-3.5 opacity-60 ${
                  isNight ? "font-mono text-white" : "font-sans text-neutral-900 font-semibold"
                }`}
              >
                Redes & Perfiles directos
              </p>
              <div className="flex gap-3">
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://github.com/Yukiseip"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub de Francisco"
                  title="GitHub"
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                    isNight
                      ? "bg-black/60 border-neutral-800 text-neutral-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                      : "bg-white border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-900 hover:text-white shadow-xs"
                  }`}
                >
                  <GithubIcon />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://www.linkedin.com/in/francisco-cr-50ba66401/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de Francisco"
                  title="LinkedIn"
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                    isNight
                      ? "bg-black/60 border-neutral-800 text-neutral-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                      : "bg-white border-neutral-200 text-neutral-800 hover:border-[#D13030] hover:bg-[#D13030] hover:text-white shadow-xs"
                  }`}
                >
                  <LinkedinIcon />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="https://www.youtube.com/@Yukiseif"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube de Francisco"
                  title="YouTube"
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                    isNight
                      ? "bg-black/60 border-neutral-800 text-neutral-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                      : "bg-white border-neutral-200 text-neutral-800 hover:border-red-600 hover:bg-red-600 hover:text-white shadow-xs"
                  }`}
                >
                  <YoutubeIcon />
                </motion.a>
                <motion.a
                  whileHover={{ y: -3 }}
                  href="/FranciscoCR_CV.pdf"
                  download="FranciscoCR_CV"
                  aria-label="Descargar CV"
                  title="Descargar Curriculum Vitae"
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                    isNight
                      ? "bg-black/60 border-neutral-800 text-neutral-300 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                      : "bg-white border-neutral-200 text-neutral-800 hover:border-black hover:bg-neutral-900 hover:text-white shadow-xs"
                  }`}
                >
                  <CvIcon />
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* ════ RIGHT COLUMN: Form Card ════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="lg:col-span-7 w-full"
          >
            <div
              className={`rounded-2xl p-6 sm:p-8 md:p-9 border transition-all duration-300 ${
                isNight
                  ? "bg-[#090d14]/80 border-cyan-500/20 shadow-[0_0_35px_rgba(0,255,255,0.05)] backdrop-blur-md"
                  : "bg-white/95 border-stone-200/90 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.08)] backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit">
                <span
                  className={`text-xs uppercase tracking-widest flex items-center gap-2 ${
                    isNight ? "font-mono text-cyan-400" : "font-sans font-semibold text-neutral-800"
                  }`}
                >
                  <Terminal size={14} /> Canal de Transmisión
                </span>
                <span
                  className={`text-[10px] font-mono tracking-wider opacity-50 ${
                    isNight ? "text-neutral-400" : "text-neutral-500"
                  }`}
                >
                  SSL 256-BIT
                </span>
              </div>

              <form onSubmit={handleSimulateSubmit} className="flex flex-col gap-5">
                {/* Name Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className={`text-xs font-semibold flex items-center gap-2 ${
                      isNight ? "font-mono text-neutral-300" : "font-sans text-neutral-700"
                    }`}
                  >
                    <User size={13} className="opacity-60" />
                    <span>Identificador / Nombre</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Tu nombre o empresa"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none ${
                      isNight
                        ? "bg-black/50 border-neutral-800 text-white font-mono placeholder:text-neutral-600 focus:border-[var(--accent-primary)] focus:shadow-[0_0_12px_rgba(0,255,255,0.15)]"
                        : "bg-stone-50/80 border-stone-200 text-neutral-900 font-sans placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                  />
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className={`text-xs font-semibold flex items-center gap-2 ${
                      isNight ? "font-mono text-neutral-300" : "font-sans text-neutral-700"
                    }`}
                  >
                    <Mail size={13} className="opacity-60" />
                    <span>Protocolo / Correo Electrónico</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="tu-correo@ejemplo.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none ${
                      isNight
                        ? "bg-black/50 border-neutral-800 text-white font-mono placeholder:text-neutral-600 focus:border-[var(--accent-primary)] focus:shadow-[0_0_12px_rgba(0,255,255,0.15)]"
                        : "bg-stone-50/80 border-stone-200 text-neutral-900 font-sans placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                  />
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className={`text-xs font-semibold flex items-center gap-2 ${
                      isNight ? "font-mono text-neutral-300" : "font-sans text-neutral-700"
                    }`}
                  >
                    <MessageSquare size={13} className="opacity-60" />
                    <span>Carga Útil / Mensaje</span>
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    placeholder="Describe los detalles de tu consulta, proyecto o propuesta..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm resize-none transition-all duration-200 outline-none ${
                      isNight
                        ? "bg-black/50 border-neutral-800 text-white font-mono placeholder:text-neutral-600 focus:border-[var(--accent-primary)] focus:shadow-[0_0_12px_rgba(0,255,255,0.15)]"
                        : "bg-stone-50/80 border-stone-200 text-neutral-900 font-sans placeholder:text-neutral-400 focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSent}
                  className={`mt-2 py-3.5 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold uppercase tracking-wider text-xs md:text-sm cursor-pointer transition-all duration-300 select-none ${
                    isNight
                      ? "bg-black border border-[var(--accent-primary)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-black font-mono shadow-[0_0_15px_rgba(0,255,255,0.15)] disabled:border-neutral-700 disabled:text-neutral-700 disabled:shadow-none"
                      : "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.99] font-sans shadow-md hover:shadow-lg disabled:bg-neutral-300 disabled:shadow-none"
                  }`}
                >
                  {!isSubmitting && !isSent && (
                    <>
                      <Send size={15} /> [ TRANSMITIR_DATA ]
                    </>
                  )}
                  {isSubmitting && (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin inline-block">◌</span> ENRUTANDO PAQUETES...
                    </span>
                  )}
                  {isSent && (
                    <span className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 size={16} /> TRANSMISIÓN RECIBIDA CON ÉXITO
                    </span>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

