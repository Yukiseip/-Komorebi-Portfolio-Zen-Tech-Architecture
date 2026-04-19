"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

/**
 * AppShell — gates the LoadingScreen to client-only rendering.
 *
 * Problem: if `LoadingScreen` is rendered during SSR (loaded=false on server),
 * React tries to hydrate it on the client with freshly-computed Math.random()
 * values that don't match the server output → hydration mismatch warning.
 *
 * Solution: `mounted` is false on the server and on the first client paint,
 * so `LoadingScreen` is never included in the SSR output. After the first
 * `useEffect` (client-only), `mounted` becomes true and the loading screen
 * is injected — React doesn't try to reconcile it against server HTML.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [loaded,  setLoaded]  = useState(false);
  const [mounted, setMounted] = useState(false);

  // Runs only in the browser, after first paint
  useEffect(() => { setMounted(true); }, []);

  const handleComplete = useCallback(() => setLoaded(true), []);

  return (
    <>
      {/* Only render the loading screen after client mount */}
      {mounted && !loaded && (
        <LoadingScreen onComplete={handleComplete} />
      )}
      {children}
    </>
  );
}
