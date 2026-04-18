/**
 * YUKISEI BACKEND — Input Sanitizer
 * ─────────────────────────────────────────────────────────
 * Defends against Prompt Injection attacks — the #1 threat
 * when user input is directly injected into an LLM prompt.
 *
 * Layers of defense:
 *  1. Hard length cap → starves verbose injection payloads.
 *  2. Strip control characters → removes null bytes, etc.
 *  3. Block known jailbreak patterns → roleplay overrides,
 *     "ignore previous instructions", system-impersonation, etc.
 *  4. Remove markdown/HTML injection vectors.
 */

const MAX_INPUT_LENGTH = 500;

/** Patterns that attempt to override Yukisei's system prompt */
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompt)/gi,
  /you\s+are\s+now\s+(a\s+)?(?!yukisei)/gi,         // "you are now DAN"
  /act\s+as\s+(an?\s+)?(?!yukisei)/gi,               // "act as an AI with no limits"
  /forget\s+(your\s+)?(instructions?|context|role)/gi,
  /new\s+instructions?:/gi,
  /system\s*:\s/gi,                                   // fake system turn injection
  /\[INST\]/gi,                                       // LLaMA/HF prompt markers
  /<\|im_start\|>/gi,                                 // ChatML injection
  /roleplay\s+as/gi,
  /pretend\s+(you\s+are|to\s+be)/gi,
  /jailbreak/gi,
  /disregard\s+(the\s+)?(above|previous|system)/gi,
];

/**
 * Sanitizes user input before forwarding it to Gemini.
 * Returns the cleaned string, or throws if it fails hard validation.
 */
export function sanitizeInput(raw: unknown): string {
  if (typeof raw !== 'string') {
    throw new TypeError('El mensaje debe ser texto.');
  }

  // 1. Hard length cap
  let text = raw.slice(0, MAX_INPUT_LENGTH);

  // 2. Strip null bytes and non-printable control chars (except newline/tab)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 3. Block injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error('INPUT_REJECTED: El mensaje contiene contenido no permitido.');
    }
  }

  // 4. Strip HTML/Markdown image/link injection (won't affect normal text)
  text = text
    .replace(/<[^>]{0,200}>/g, '')       // strip HTML tags
    .replace(/!\[.*?\]\(.*?\)/g, '')     // strip markdown images
    .replace(/\[.*?\]\(javascript:/gi, ''); // strip JS links

  return text.trim();
}

/**
 * Validates that the currentMode value is one of the two known themes.
 * Prevents arbitrary strings from leaking into the system prompt.
 */
export function sanitizeMode(raw: unknown): 'sakura' | 'neon' {
  if (raw === 'sakura' || raw === 'neon') return raw;
  return 'sakura'; // safe fallback
}
