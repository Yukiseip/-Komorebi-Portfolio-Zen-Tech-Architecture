import { HeroSection } from "@/components/sections/HeroSection";
import { AboutMe } from "@/components/sections/AboutMe";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { DialogueNovel } from "@/components/ui/DialogueNovel";
import { SectionDivider } from "@/components/ui/SectionDivider";

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
      <DialogueNovel />
    </main>
  );
}
