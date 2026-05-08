import { HeroSection } from "@/components/sections/HeroSection";
import { AboutMe } from "@/components/sections/AboutMe";
import { SectionDivider } from "@/components/ui/SectionDivider";
// DialogueNovel loaded via client-wrapper (ssr:false not allowed in Server Components)
import { DialogueNovelLoader } from "@/components/ui/DialogueNovelLoader";
import dynamic from "next/dynamic";

// ── Below-fold sections: lazy-loaded to cut initial JS bundle & parse time ──
const SkillsSection = dynamic(
  () => import("@/components/sections/SkillsSection").then((m) => m.SkillsSection),
  { ssr: true }
);
const ProjectsSection = dynamic(
  () => import("@/components/sections/ProjectsSection").then((m) => m.ProjectsSection),
  { ssr: true }
);
const TimelineSection = dynamic(
  () => import("@/components/sections/TimelineSection").then((m) => m.TimelineSection),
  { ssr: true }
);
const FooterSection = dynamic(
  () => import("@/components/sections/FooterSection").then((m) => m.FooterSection),
  { ssr: true }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full relative">
      <HeroSection />
      <SectionDivider />
      <AboutMe />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <ProjectsSection />
      <SectionDivider />
      <TimelineSection />
      <FooterSection />
      <DialogueNovelLoader />
    </main>
  );
}
