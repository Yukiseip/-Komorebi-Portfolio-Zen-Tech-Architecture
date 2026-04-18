/**
 * YUKISEI AI — /api/chat — Edge Route Handler
 * ─────────────────────────────────────────────────────────
 * Runtime:  Vercel Edge (sub-10ms cold start)
 * Provider cascade:
 *   1. Gemini 2.5 Flash  (primary)
 *   2. Groq llama-3.3-70b (fallback when Gemini is down / quota)
 *   3. Friendly exhaustion message  (both providers unavailable)
 *
 * SECURITY:
 *  - API keys only from process.env — never logged, never in responses
 *  - All error messages sanitized before leaving the server
 *  - Client IP rate-limited (15 req/min) before any model call
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter';
import { sanitizeInput, sanitizeMode }  from '@/lib/sanitize';
import { buildSystemPrompt, type Mode } from '@/lib/system-prompt';

export const runtime = 'edge';

// ── Models ────────────────────────────────────────────────
const GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';
const MAX_HISTORY  = 10;

// ── Generation config ─────────────────────────────────────
// thinkingBudget: 0 → disable Gemini 2.5's internal reasoning chain
// (without it, the model spends all output tokens "thinking" → empty responses)
const GEMINI_CONFIG = {
  temperature:     0.85,
  maxOutputTokens: 600,
  topP:            0.95,
  topK:            40,
  // @ts-ignore — thinkingConfig is valid on 2.5 models but not yet in SDK @types
  thinkingConfig: { thinkingBudget: 0 },
} as const;

const GROQ_CONFIG = {
  temperature: 0.85,
  max_tokens:  600,
  top_p:       0.95,
} as const;

// ── Gemini safety settings ────────────────────────────────
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

// ── Yukisei's exhaustion message (shown when ALL providers fail) ───
const EXHAUSTION_MSG =
  '✦ *Vaya... parece que este portafolio se ha vuelto demasiado popular esta noche.* ' +
  'Los límites de energía del sistema han sido alcanzados por hoy. ' +
  'Vuelve mañana y continuamos nuestra conversación, ¿de acuerdo? ✦';

// ── Types ─────────────────────────────────────────────────
interface ClientMessage { role: 'ai' | 'user'; text: string; }

// ── Helpers ───────────────────────────────────────────────
function errorResponse(msg: string, status: number): Response {
  return Response.json({ error: msg }, { status });
}

/** Returns true for errors that should trigger a provider fallback */
function isFallbackError(err: unknown): boolean {
  const m = err instanceof Error ? err.message : String(err);
  return (
    m.includes('429') || m.includes('503') || m.includes('quota') ||
    m.includes('RESOURCE_EXHAUSTED') || m.includes('Service Unavailable') ||
    m.includes('rate_limit_exceeded') || m.includes('overloaded')
  );
}

// ── SSE stream builders ───────────────────────────────────

function geminiToSSE(
  stream: AsyncIterable<{ text: () => string }>
): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    async start(ctrl) {
      try {
        for await (const chunk of stream) {
          const t = chunk.text();
          if (t) ctrl.enqueue(enc.encode(`data: ${t.replace(/\n/g, '\\n')}\n\n`));
        }
        ctrl.enqueue(enc.encode('data: [DONE]\n\n'));
      } catch (e) {
        ctrl.enqueue(enc.encode(`data: [ERROR] ${String(e).slice(0, 80)}\n\n`));
      } finally {
        ctrl.close();
      }
    },
  });
}

function groqToSSE(
  stream: AsyncIterable<Groq.Chat.Completions.ChatCompletionChunk>
): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    async start(ctrl) {
      try {
        for await (const chunk of stream) {
          const t = chunk.choices[0]?.delta?.content ?? '';
          if (t) ctrl.enqueue(enc.encode(`data: ${t.replace(/\n/g, '\\n')}\n\n`));
        }
        ctrl.enqueue(enc.encode('data: [DONE]\n\n'));
      } catch (e) {
        ctrl.enqueue(enc.encode(`data: [ERROR] ${String(e).slice(0, 80)}\n\n`));
      } finally {
        ctrl.close();
      }
    },
  });
}

// ── Route ─────────────────────────────────────────────────
export async function POST(req: Request): Promise<Response> {

  // 1. Rate limit
  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return errorResponse(
      'Demasiadas consultas seguidas. Espera un momento, el sistema necesita respirar.',
      429
    );
  }

  // 2. Parse body
  let body: unknown;
  try { body = await req.json(); }
  catch { return errorResponse('Solicitud JSON inválida.', 400); }
  if (typeof body !== 'object' || body === null) return errorResponse('Solicitud malformada.', 400);

  const { history, currentMode } = body as Record<string, unknown>;

  // 3. Validate + sanitize
  if (!Array.isArray(history) || history.length === 0)
    return errorResponse('Historial de conversación inválido.', 400);

  const mode: Mode = sanitizeMode(currentMode);
  const sanitized: ClientMessage[] = [];

  for (const msg of history) {
    if (typeof msg !== 'object' || msg === null || !['ai','user'].includes((msg as ClientMessage).role))
      return errorResponse('Formato de historial inválido.', 400);
    const cm = msg as ClientMessage;
    try {
      sanitized.push({
        role: cm.role,
        text: cm.role === 'user' ? sanitizeInput(cm.text) : String(cm.text).slice(0, 2000),
      });
    } catch (e) {
      return errorResponse(e instanceof Error ? e.message : 'Mensaje rechazado.', 400);
    }
  }

  const trimmed = sanitized.slice(-MAX_HISTORY);
  const lastMsg = trimmed[trimmed.length - 1];
  if (lastMsg.role !== 'user') return errorResponse('El último mensaje debe ser del usuario.', 400);

  // 4. Keys (never log values)
  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey   = process.env.GROQ_API_KEY;

  const systemPrompt = buildSystemPrompt(mode);
  const sseHeaders = {
    'Content-Type':          'text/event-stream',
    'Cache-Control':         'no-cache, no-transform',
    'Connection':            'keep-alive',
    'X-RateLimit-Remaining': String(remaining),
  };

  // ── 5a. Primary: Gemini 2.5 Flash ─────────────────────
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel(
        { model: GEMINI_MODEL, systemInstruction: systemPrompt, generationConfig: GEMINI_CONFIG, safetySettings: SAFETY_SETTINGS },
        { apiVersion: 'v1beta' }
      );

      // Gemini history must start with 'user'
      const raw = trimmed.slice(0, -1).map(m => ({
        role:  m.role === 'ai' ? ('model' as const) : ('user' as const),
        parts: [{ text: m.text }],
      }));
      let si = 0;
      while (si < raw.length && raw[si].role === 'model') si++;
      const geminiHistory = raw.slice(si);

      const chat   = model.startChat({ history: geminiHistory });
      const result = await chat.sendMessageStream(lastMsg.text);

      return new Response(
        geminiToSSE((async function*() { for await (const c of result.stream) yield c; })()),
        { headers: { ...sseHeaders, 'X-AI-Provider': 'gemini' } }
      );

    } catch (err) {
      const m = err instanceof Error ? err.message : '';
      if (m.includes('SAFETY'))
        return errorResponse('La respuesta fue bloqueada por los filtros de seguridad.', 500);
      if (!isFallbackError(err))
        console.error('[YUKISEI] Gemini unexpected error:', m.slice(0, 200));
      console.warn('[YUKISEI] Gemini unavailable — switching to Groq fallback.');
    }
  }

  // ── 5b. Fallback: Groq ────────────────────────────────
  if (groqKey) {
    try {
      const groq = new Groq({ apiKey: groqKey });

      const oaiMsgs: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...trimmed.map(m => ({
          role:    m.role === 'ai' ? ('assistant' as const) : ('user' as const),
          content: m.text,
        })),
      ];

      const stream = await groq.chat.completions.create({
        model:    GROQ_MODEL,
        messages: oaiMsgs,
        stream:   true,
        ...GROQ_CONFIG,
      });

      return new Response(
        groqToSSE(stream),
        { headers: { ...sseHeaders, 'X-AI-Provider': 'groq-fallback' } }
      );

    } catch (err) {
      const m = err instanceof Error ? err.message.slice(0, 200) : '';
      console.error('[YUKISEI] Groq fallback error:', m);
    }
  }

  // ── 5c. Both providers exhausted ─────────────────────
  // Return Yukisei's in-character exhaustion message instead of a cold error
  const enc = new TextEncoder();
  const exhaustionStream = new ReadableStream<Uint8Array>({
    start(ctrl) {
      ctrl.enqueue(enc.encode(`data: ${EXHAUSTION_MSG.replace(/\n/g, '\\n')}\n\n`));
      ctrl.enqueue(enc.encode('data: [DONE]\n\n'));
      ctrl.close();
    },
  });

  return new Response(exhaustionStream, {
    headers: { ...sseHeaders, 'X-AI-Provider': 'none' },
  });
}
