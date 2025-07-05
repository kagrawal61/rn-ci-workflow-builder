import { BenefitsSection } from '@/components/benefits-section';
import { FooterSection } from '@/components/footer-section';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { SupportedFrameworks } from '@/components/supported-frameworks';
import { WorkflowBuilder } from '@/components/workflow-builder';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <WorkflowBuilder />
      <SupportedFrameworks />
      <FooterSection />
    </main>
  );
}
