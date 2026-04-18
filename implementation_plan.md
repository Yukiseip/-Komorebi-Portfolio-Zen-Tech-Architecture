# Objetivo del Proyecto: Fase 1 y 2 de "Komorebi-Neon"

Construir un portafolio web de alto impacto para un Ingeniero en Sistemas, utilizando Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, Howler.js y Lucide React. El diseño reflejará una dualidad temática:
- **Día (Sakura)**: Estética Zen Japonesa, minimalista, blanco hueso, acentos rosa y tipografía elegante (Serif/Sans).
- **Noche (Neon)**: Cyberpunk Tokyo, fondo negro, neón cian/magenta, interfaces glitch y tipografía Monospace.

## User Review Required

> [!IMPORTANT]
> El proyecto se inicializará en `c:\Users\narut_m0l39d\Desktop\Project\Portafolio2`. ¿Deseas algún gestor de paquetes en específico (npm, pnpm, yarn)? Si no se especifica, se usará `npm`.
> 
> También, respecto al "Sello Hanko", haré un diseño con CSS puro y un SVG/Icono para mantener la eficiencia. Si tienes un SVG específico para el sello, avísame.

## Proposed Changes

---
### Inicialización del Proyecto y Dependencias

- **[NUEVO]** Se inicializará la aplicación Next.js con Tailwind y TypeScript.
- **[NUEVO]** Se instalarán dependencias clave: `framer-motion`, `howler`, `@types/howler`, `lucide-react`, `clsx`, `tailwind-merge`.

---
### Arquitectura de Temas (Fase 1)

#### [MODIFICAR] `src/app/globals.css`
- Eliminaremos los estilos por defecto.
- Definiremos los **Design Tokens** mediante variables CSS en la raíz (`:root` o `[data-theme="sakura"]`) para el tema Día y en `[data-theme="neon"]` para la Noche.
- Configuración de utilidades base y reseteos.

#### [MODIFICAR] `tailwind.config.ts`
- Mapear las variables CSS de `globals.css` en las secciones de `colors`, `fontFamily` y `boxShadow/dropShadow` (para efectos neon glow).
- Configurar las tipografías: Inter/Serif (Día) y Roboto Mono/Geist Mono (Noche).

#### [NUEVO] `src/contexts/ThemeContext.tsx`
- Implementación de un estado global de React que gestione la selección manual del tema ("sakura" o "neon").
- Persistencia local opcional.
- Mutará un atributo `data-theme` en la etiqueta de orden superior o el `body`.

#### [NUEVO] `src/components/ui/ThemeToggle.tsx`
- Componente que actuará como el "Sello Hanko" (Hanko Stamp).
- Estará posicionado de manera fija (ej. top-right).
- Al hacer clic: cambiará el estado del tema y también inicializará el contexto de audio vacío en Howler.js (`AudioContext`) para el modo interactivo que viene en fases posteriores.

---
### Hero & Scrollytelling (Fase 2)

#### [NUEVO] `src/app/fonts.ts` o configuración de fuentes en `layout.tsx`
- Importar y configurar fuentes de Google (ej. `Noto Serif JP` para Día, `Share Tech Mono` para Noche) optimizadas con `next/font`.

#### [MODIFICAR] `src/app/layout.tsx`
- Incluir `ThemeContext.Provider`.
- Aplicar los estilos globales.

#### [MODIFICAR] `src/app/page.tsx`
- Estructura principal de *Scrollytelling*. Contenedor con comportamiento de snap o transiciones manuales basadas en scroll configurando secciones con 100vh.

#### [NUEVO] `src/components/ui/AmbientBackground.tsx`
- Fondo dinámico detrás de todo el contenido.
- **Día**: Renderización por intervalos de pétalos de flor de cerezo cayendo y disipándose (Framer Motion / CSS Animations).
- **Noche**: Un *grid* de perspectiva neón al estilo synthwave retro-futurista, dibujado con CSS/SVG.

#### [NUEVO] `src/hooks/useScrollInteraction.ts`
- Hook de React que usará `framer-motion/useScroll` o listeners de eventos nativos para determinar la sección activa (por ejemplo de 0 a 100vh es el Hero, 100vh a 200vh es Sobre Mí) y lanzar animaciones coordinadas.

#### [NUEVO] `src/components/sections/HeroSection.tsx`
- El encabezado de altura completa (100vh).
- Componente tipográfico principal impulsado por Framer Motion. 
- Contendrá lógica condicional de estilo:
  - **Día**: Trazos de pincel (aparición en *fade in* / *clip path* suave).
  - **Noche**: Efecto de texto *glitch* y parpadeo intermitente.

#### [NUEVO] `src/components/sections/AboutMe.tsx`
- Sección secundaria (100vh) a la que se deslizará el scrollytelling. Se dejará configurada la estructura base para recibir la siguiente fase.

## Open Questions

- ¿La transición del scrollytelling quieres que sea un "Scroll-Snap" estricto (CSS `scroll-snap-type`) o prefieres que el usuario haga scroll normal y ciertos elementos simplemente se "peguen" e interactúen? Recomiendo Framer Motion u observer pattern para animar según progreso, sin forzar la rueda de scroll, que puede resultar invasivo.
- ¿Qué fuentes exactas prefieres? (ej: 'Noto Serif JP' / 'Inter' para el día, y 'Share Tech Mono' para la noche).

## Verification Plan

### Verificación Automática (Desarrollo)
- Inicializar el servidor Next.js (`npm run dev`).
- Asegurarse de que no existan errores de linting en terminal.
- Construcción sin errores (`npm run build`).

### Verificación Manual (Visual y UI)
- Revisar el botón de Theme Toggle interactivo, verificar que la paleta cambie suavemente.
- Visualizar en la consola del navegador que `Howler.js` inicializa correctamente su contexto en el primer click.
- Verificar el efecto de Scrollytelling, desplazándose a la sección *Sobre Mí*.
- Confirmar responsividad en dispositivos móviles viendo en los Developer Tools del navegador.
