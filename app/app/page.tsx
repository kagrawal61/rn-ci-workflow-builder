import { HeroSection } from '@/components/hero-section';
import { WorkflowBuilder } from '@/components/workflow-builder';
import { FooterSection } from '@/components/footer-section';
import { Header } from '@/components/header';
import { SupportedFrameworks } from '@/components/supported-frameworks';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <HeroSection />
      <WorkflowBuilder />
      <SupportedFrameworks />
      <FooterSection />
    </main>
  );
}
