"use client";

import dynamic from "next/dynamic";

// DialogueNovel is a heavy, client-only interactive component.
// This client wrapper enables ssr:false (not allowed in Server Components).
const DialogueNovel = dynamic(
  () => import("@/components/ui/DialogueNovel").then((m) => m.DialogueNovel),
  { ssr: false }
);

export function DialogueNovelLoader() {
  return <DialogueNovel />;
}
