/**
 * YUKISEI BACKEND — Rate Limiter
 * ─────────────────────────────────────────────────────────
 * Edge-compatible in-memory sliding window rate limiter.
 * Limits requests per IP to prevent API quota exhaustion.
 *
 * Strategy: Sliding window — max N requests per WINDOW_MS.
 * NOTE: For multi-instance Edge deployments, swap the Map
 * for a KV store (e.g. Vercel KV / Redis) in the future.
 */

const WINDOW_MS = 60_000; // 1-minute window
const MAX_REQUESTS = 15;  // max 15 requests per IP per minute

// Stores timestamps of requests keyed by IP
const requestLog = new Map<string, number[]>();

/**
 * Returns true if the IP is allowed, false if rate-limited.
 * Automatically prunes expired timestamps to avoid memory leaks.
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  // Get existing timestamps and prune those outside the window
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  // Record this request
  timestamps.push(now);
  requestLog.set(ip, timestamps);

  return { allowed: true, remaining: MAX_REQUESTS - timestamps.length };
}

/**
 * Extracts a reliable client IP from the incoming Edge request.
 * Vercel injects `x-forwarded-for`; falls back to a safe default.
 */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // On localhost there's no IP header — use a constant key
  return 'localhost';
}
