"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useAi } from "@/components/providers/AiProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

// ─── Delay helpers ────────────────────────────────────────────────────────────
const BASE_DELAY       = 35;   // ms per character
const COMMA_DELAY      = 200;  // ms pause after , ; :
const SENTENCE_DELAY   = 500;  // ms pause after . ! ?
const SPACE_DELAY      = 0;    // spaces are instant

function charDelay(ch: string): number {
  if (ch === ' ')                         return SPACE_DELAY;
  if ([',', ';', ':'].includes(ch))       return COMMA_DELAY;
  if (['.', '!', '?', '…'].includes(ch)) return SENTENCE_DELAY;
  return BASE_DELAY;
}

const PUNCTUATION_PAUSE = new Set(['.', '!', '?', '…', ',', ';', ':']);

// ─── Audio engine ─────────────────────────────────────────────────────────────
/**
 * Plays a single short blip using the Web Audio API.
 *  - baseFreq : Hz for the oscillator (day=520 Hz, night=320 Hz)
 *  - pitchVar : random ±% variation  (default ±5%)
 * Stops any previous oscillator cleanly to avoid clipping.
 */
let activeOscillator: OscillatorNode | null = null;

function playBlip(ctx: AudioContext, baseFreq: number, pitchVar = 0.05) {
  try {
    // Stop previous cleanly
    if (activeOscillator) {
      try { activeOscillator.stop(); } catch (_) {}
      activeOscillator = null;
    }

    const variation  = 1 + (Math.random() * 2 - 1) * pitchVar; // ±5%
    const freq       = baseFreq * variation;
    const now        = ctx.currentTime;
    const duration   = 0.04; // 40ms — short, not intrusive

    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';  // sine is much softer than square — less grating
    osc.frequency.setValueAtTime(freq, now);

    // Tiny volume envelope: fade in 5ms, hold, fade out 10ms
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.005);
    gain.gain.setValueAtTime(0.08, now + duration - 0.01);
    gain.gain.linearRampToValueAtTime(0, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
    activeOscillator = osc;
  } catch (_) {}
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = { role: 'ai' | 'user'; text: string };

// ─── Component ────────────────────────────────────────────────────────────────
export function DialogueNovel() {
  const { theme, setThemeDirectly } = useTheme();
  const { isOpen, message: initialMessage, closeAi } = useAi();

  const [messages,      setMessages]      = useState<Message[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping,      setIsTyping]      = useState(false);
  const [isLoading,     setIsLoading]     = useState(false);
  const [inputValue,    setInputValue]    = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const typingRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lazy-init AudioContext (must be created on user gesture)
  const getAudioCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Release OS audio session on unmount
  useEffect(() => {
    return () => { audioCtxRef.current?.close().catch(() => {}); };
  }, []);

  // ── Reset on open / close ────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setMessages([{ role: 'ai', text: initialMessage }]);
      setInputValue("");
    } else {
      setMessages([]);
      setDisplayedText("");
      setIsTyping(false);
    }
  }, [isOpen, initialMessage]);

  // ── Typewriter for welcome / static messages ─────────────
  useEffect(() => {
    if (!isOpen || messages.length === 0) return;
    const latest = messages[messages.length - 1];
    if (latest.role !== 'ai') return;

    // Only run typewriter for the *initial* welcome message.
    // Streamed messages update in real-time via handleInputSubmit.
    if (messages.length > 1) return;

    setDisplayedText("");
    setIsTyping(true);

    const text = latest.text;
    let i = 0;
    let charCount = 0; // tracks chars since last blip

    // Mode-specific blip settings
    const isNight   = theme === 'neon';
    const baseFreq  = isNight ? 320 : 520;   // night = darker tone
    const blipEvery = isNight ? 2 : 3;       // night = every 2 chars, day = every 3

    function scheduleNext() {
      if (i >= text.length) {
        setIsTyping(false);
        return;
      }
      const ch    = text[i];
      const delay = charDelay(ch);

      typingRef.current = setTimeout(() => {
        i++;
        setDisplayedText(text.slice(0, i));

        // Audio logic
        const ctx = getAudioCtx();
        if (ctx && ch !== ' ' && !PUNCTUATION_PAUSE.has(ch)) {
          charCount++;
          if (charCount % blipEvery === 0) {
            playBlip(ctx, baseFreq);
          }
        }
        // Silence during punctuation pauses (charCount not incremented)

        scheduleNext();
      }, delay);
    }

    scheduleNext();

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isOpen]);

  // ── Auto-scroll ──────────────────────────────────────────
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedText, messages]);

  // ── Submit handler (streaming) ───────────────────────────
  const handleInputSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || inputValue.trim() === "" || isTyping || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");

    const newHistory: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newHistory);
    setIsLoading(true);

    const aiPlaceholder: Message = { role: 'ai', text: '' };
    setMessages([...newHistory, aiPlaceholder]);

    // Mode-specific blip settings for streamed responses
    const isNight   = theme === 'neon';
    const baseFreq  = isNight ? 320 : 520;
    const blipEvery = isNight ? 2 : 3;
    let streamCharCount = 0;

    const blipStream = (chunk: string) => {
      const ctx = getAudioCtx();
      if (!ctx) return;
      for (const ch of chunk) {
        if (ch !== ' ' && !PUNCTUATION_PAUSE.has(ch)) {
          streamCharCount++;
          if (streamCharCount % blipEvery === 0) {
            playBlip(ctx, baseFreq);
          }
        }
      }
    };

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ history: newHistory, currentMode: theme }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg  = (errData as { error?: string }).error ?? 'Error de conexión con el sistema.';
        setMessages([...newHistory, { role: 'ai', text: errMsg }]);
        return;
      }

      const reader  = res.body!.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';
      let   full    = '';

      setIsLoading(false);
      setIsTyping(true);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data:')) continue;

          const payload = line.slice(5).trim();
          if (payload === '[DONE]') break;
          if (payload.startsWith('[ERROR]')) {
            full += '\n' + payload.replace('[ERROR]', '').trim();
            continue;
          }

          const chunk = payload.replace(/\\n/g, '\n');
          full += chunk;

          // Audio per streamed chunk
          blipStream(chunk);

          setMessages(prev => {
            const next = [...prev];
            next[next.length - 1] = { role: 'ai', text: full };
            return next;
          });

          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }
      }

      // Strip mode-switch tags
      let finalText = full;
      if (finalText.includes('[MODE_SWITCH: NIGHT]')) {
        finalText = finalText.replace('[MODE_SWITCH: NIGHT]', '').trim();
        setThemeDirectly?.('neon');
      }
      if (finalText.includes('[MODE_SWITCH: DAY]')) {
        finalText = finalText.replace('[MODE_SWITCH: DAY]', '').trim();
        setThemeDirectly?.('sakura');
      }
      if (finalText !== full) {
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { role: 'ai', text: finalText };
          return next;
        });
      }

    } catch (error) {
      console.error('AI stream error:', error);
      setMessages([...newHistory, { role: 'ai', text: 'Error de red. Reconectando al sistema...' }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const avatarImg = theme === 'sakura'
    ? '/imagenes/Yukisei2_day.jpg'
    : '/imagenes/Yukisei2_night.jpg';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 20 }}
          className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-[10%] md:right-[10%] z-[100] flex items-end drop-shadow-2xl px-2 pb-2 md:px-0 md:pb-0"
        >
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 md:w-32 md:h-32 mb-4 shrink-0 relative mr-4 bg-black/20 rounded-md overflow-hidden border-2"
            style={{
              borderColor: theme === 'sakura' ? '#E89EAD' : 'var(--accent-primary)',
              boxShadow:   theme === 'neon'   ? '0 0 10px var(--accent-primary)' : 'none',
            }}
          >
            <Image src={avatarImg} alt="Yukisei IA" fill className="object-cover" sizes="128px" />
          </motion.div>

          {/* Dialogue box wrapper — relative so the speaker tag can overflow upward */}
          <div className="flex-1 min-w-0 relative pt-3">
            {/* Speaker tag — sits above the border */}
            <div className={`absolute top-0 left-4 px-2 py-1 text-xs font-bold uppercase tracking-wider z-10
              ${theme === 'sakura' ? 'bg-[#D13030] text-white' : 'bg-[var(--accent-primary)] text-black'}`}
            >
              Yukisei
            </div>

          {/* Dialogue box — fixed height, never grows */}
          <div className={`backdrop-blur-md border-[3px] p-3 md:p-6 relative flex flex-col
            h-[48svh] max-h-[360px] md:h-[320px] md:max-h-none overflow-hidden
            ${theme === 'sakura'
              ? 'bg-[#FFF5F5]/95 border-[#D13030] shadow-[4px_4px_0_rgba(209,48,48,0.3)] text-[#1A1A1A] rounded-lg'
              : 'bg-[#050505]/95 border-[var(--accent-primary)] shadow-[0_0_20px_rgba(0,255,255,0.3)] text-[var(--accent-primary)]'
            }`}
          >

            {/* Chat history — scrollable, min-h-0 needed for overflow to work inside flex */}
            <div
              ref={scrollRef}
              className={`flex-1 min-h-0 overflow-y-auto mb-3 text-xs sm:text-sm md:text-base leading-relaxed flex flex-col gap-3 pr-1
                ${theme === 'sakura' ? 'font-serif' : 'font-mono'}`}
              style={{ scrollBehavior: 'smooth', overscrollBehavior: 'contain' }}
            >
              {messages.map((msg, idx) => {
                const isLast = idx === messages.length - 1;
                if (msg.role === 'user') {
                  return (
                    <div key={idx} className="self-end max-w-[80%] bg-black/10 p-2 rounded break-words">
                      <span className="opacity-70 text-xs block mb-1">Tú:</span>
                      {msg.text}
                    </div>
                  );
                }
                return (
                  <div key={idx} className="self-start max-w-full break-words whitespace-pre-wrap">
                    {/* Welcome message uses typewriter displayedText; all others show full text */}
                    {isLast && isTyping && messages.length === 1 ? (
                      <>
                        {displayedText}
                        <span className={`inline-block w-2 md:w-3 h-4 ml-1 animate-pulse
                          ${theme === 'sakura' ? 'bg-[#D13030]' : 'bg-[var(--accent-primary)]'}`}
                        />
                      </>
                    ) : isLast && isTyping && messages.length > 1 ? (
                      <>
                        {msg.text}
                        <span className={`inline-block w-2 md:w-3 h-4 ml-1 animate-pulse
                          ${theme === 'sakura' ? 'bg-[#D13030]' : 'bg-[var(--accent-primary)]'}`}
                        />
                      </>
                    ) : (
                      msg.text
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="self-start opacity-70 animate-pulse">
                  {theme === 'sakura' ? 'Yukisei está pensando...' : '[Procesando datos...]'}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-dashed border-current pt-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm opacity-70">
                  {theme === 'sakura' ? '>> ' : '> '}
                </span>
                <input
                  type="text"
                  inputMode="text"
                  enterKeyHint="send"
                  className={`w-full bg-transparent border-none outline-none text-sm md:text-base font-mono
                    ${theme === 'sakura'
                      ? 'text-[#1A1A1A] placeholder:text-gray-400'
                      : 'text-[var(--text-primary)] placeholder:text-gray-600'}`}
                  placeholder={isLoading || isTyping ? "Espera..." : "Escribe y presiona Enter..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputSubmit}
                  disabled={isLoading || isTyping}
                />
              </div>
            </div>

            {/* Close */}
            <button
              onClick={closeAi}
              className="absolute top-2 right-2 opacity-50 hover:opacity-100 text-xl font-bold"
            >
              ×
            </button>
          </div>
          </div> {/* end wrapper */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
