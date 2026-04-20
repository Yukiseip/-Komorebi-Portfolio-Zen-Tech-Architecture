# Francisco Calvo — Portafolio Inteligente

> Un portafolio de desarrollador construido como producto de software: arquitectura real, IA integrada, animaciones de grado de producción y experiencia dual Día/Noche.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Gemini 2.5](https://img.shields.io/badge/Gemini-2.5_Flash-orange?logo=google)](https://ai.google.dev)
[![Groq](https://img.shields.io/badge/Groq-Fallback-red)](https://groq.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## ¿Qué es este proyecto?

Este portafolio no es una plantilla ni un sitio estático — es una **aplicación web completa** diseñada para demostrar competencias técnicas de nivel profesional a través de su propia arquitectura. Cada decisión de diseño tiene intención: desde el sistema de temas hasta el motor de IA conversacional integrado.

**¿Por qué importa?** Para un reclutador o colaborador, ver este portafolio es ver al desarrollador en acción: manejo de estado complejo, integración de APIs de producción, animaciones avanzadas y pensamiento de sistema end-to-end.

---

## ✨ Características principales

### 🤖 Yukisei AI — Asistente Inteligente
Un chat RPG en tiempo real que responde preguntas sobre Francisco usando IA generativa:

- **Motor primario:** Google Gemini 2.5 Flash (streaming SSE)
- **Fallback automático:** Groq `llama-3.3-70b-versatile` cuando Gemini está sobrecargado
- **RAG simplificado:** Context base desde `Yukisei.md` (fuente única de verdad)
- **Personalidad dual:** Shrine Maiden (Día 🌸) / System Admin (Noche 🌃) con prompt engineering avanzado
- **Seguridad:** Rate limiting por IP, sanitización multi-capa contra prompt injection, keys 100% server-side

### 🎨 Sistema de Temas Dual
- **Modo Día (Sakura):** Estética japonesa — tipografía serif, tonos rosados, animaciones de pétalos
- **Modo Noche (Neon):** Cyberpunk — fuente monoespaciada, cyan neón, scan lines
- Cambio de tema con sonido: acorde ascendente C-E-G (día) / drone descendente A-D (noche)
- Persistencia en `localStorage`

### 🕸️ Ecosistema Tecnológico Interactivo
Mapa de habilidades tipo grafo con 5 hubs maestros y 25+ nodos satélite:
- Hover revela conexiones entre tecnologías con líneas animadas
- Nodos flotantes con movimiento autónomo Lissajous
- Tooltip descriptivo por tecnología

### ⚡ Experiencia de Alta Fidelidad
- Animaciones con **Framer Motion** (parallax, spring physics, layout animations)
- Scroll fluido con **Lenis**
- Fondo dinámico generativo (`AmbientBackground`)
- Foto personal con levitación continua + lluvia de pétalos (hover, modo día)
- Efecto typewriter RPG: delay variable por puntuación, pitch shifting de audio ±5%, throttling inteligente

---

## 🛠️ Stack Técnico

| Capa | Tecnologías |
|------|-------------|
| **Framework** | Next.js 16 (App Router, Edge Runtime) |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | Tailwind CSS, CSS custom properties |
| **Animaciones** | Framer Motion, Lenis (smooth scroll) |
| **IA** | Google Generative AI SDK, Groq SDK |
| **Audio** | Web Audio API (osciladores, envelopes) |
| **Deploy** | Vercel (Free Tier, Edge Functions) |

---

## 🏗️ Arquitectura

```
src/
├── app/
│   ├── api/chat/route.ts      # Edge API: Gemini → Groq cascade, SSE streaming
│   └── page.tsx               # Layout raíz
├── components/
│   ├── providers/
│   │   ├── ThemeProvider.tsx  # Estado global de tema + sonidos de transición
│   │   └── AiProvider.tsx     # Estado del chat AI
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── AboutMe.tsx        # Foto animada, botón CTA, métricas
│   │   ├── SkillsSection.tsx  # Grafo interactivo de habilidades
│   │   ├── ProjectsSection.tsx
│   │   ├── TimelineSection.tsx
│   │   └── FooterSection.tsx  # Contacto + social links
│   └── ui/
│       ├── DialogueNovel.tsx  # Chat RPG completo con SSE y audio
│       └── ThemeToggle.tsx    # Botón modo día/noche animado
├── lib/
│   ├── system-prompt.ts       # Constructor de prompt dinámico
│   ├── yukisei-content.ts     # Base de conocimiento RAG
│   ├── rate-limiter.ts        # Sliding window per-IP
│   └── sanitize.ts            # Defensa contra prompt injection
```

### Flujo de la IA
```
Usuario → DialogueNovel → POST /api/chat
  → Rate Limiter → Sanitize → buildSystemPrompt(mode)
  → Gemini 2.5 Flash (streaming SSE)
    └─ Si falla (503/429) → Groq llama-3.3-70b (streaming SSE)
       └─ Si falla → Mensaje de Yukisei en el stream
  → Cliente: SSE reader → typewriter + audio engine
```

---

## 🚀 Setup local

```bash
# 1. Clonar
git clone https://github.com/Yukiseip/portafolio2
cd portafolio2

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.example .env.local
# Editar .env.local con tus keys:
# GEMINI_API_KEY=...   (Google AI Studio)
# GROQ_API_KEY=...     (console.groq.com)

# 4. Correr en desarrollo
npm run dev
```

> ⚠️ **Nunca uses `NEXT_PUBLIC_` para keys de IA.** Quedan expuestas en el bundle del navegador. Ambas keys deben ser server-only.

---

## 🔐 Seguridad implementada

| Medida | Descripción |
|--------|-------------|
| **Keys server-only** | Sin `NEXT_PUBLIC_` — nunca llegan al cliente |
| **Rate limiting** | 15 req/min por IP con sliding window en memoria |
| **Sanitización** | Strip HTML, control chars, 10 patrones de jailbreak |
| **Error sanitization** | Mensajes de error filtrados antes de llegar al cliente |
| **`.gitignore`** | `.env*` excluido del repositorio |

---

## 📦 Variables de entorno (Vercel)

Configura estas variables en **Settings → Environment Variables**:

| Variable | Proveedor | Dónde obtenerla |
|----------|-----------|-----------------|
| `GEMINI_API_KEY` | Google AI Studio | [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `GROQ_API_KEY` | Groq | [console.groq.com](https://console.groq.com/keys) |

---

## 👤 Sobre Francisco Calvo

Ingeniero en Sistemas egresado de UVEG (México), especializado en **IA aplicada y desarrollo Full Stack**. Construye productos en la intersección entre UX de calidad y backends eficientes.

📍 México · [LinkedIn](https://www.linkedin.com/in/francisco-cr-50ba66401/) · [GitHub](https://github.com/Yukiseip)

---

<div align="center">
  <sub>Construido con 🌸 en México · © 2025 Francisco Calvo</sub>
</div>
