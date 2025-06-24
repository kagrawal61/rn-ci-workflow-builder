import { HeroSection } from "@/components/hero-section";
import { WorkflowBuilder } from "@/components/workflow-builder";
import { FooterSection } from "@/components/footer-section";
import { Header } from "@/components/header";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <HeroSection />
      <WorkflowBuilder />
      <FooterSection />
    </main>
  );
}