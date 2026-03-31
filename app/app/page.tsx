import { BenefitsSection } from '@/components/benefits-section';
import { FooterSection } from '@/components/footer-section';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { HowItWorks } from '@/components/how-it-works';
import { SupportedFrameworks } from '@/components/supported-frameworks';
import { WorkflowBuilder } from '@/components/workflow-builder';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'React Native CI/CD Workflow Builder',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  url: 'https://www.mobilecibuilder.com',
  description:
    'Generate production-ready GitHub Actions and Bitrise CI/CD workflows for React Native and Expo apps in minutes. Free, open-source, no account required.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'GitHub Actions workflow generation',
    'Bitrise workflow generation',
    'React Native CI/CD pipeline',
    'Expo build automation',
    'Static analysis pipeline',
    'Android and iOS build workflows',
    'Artifact storage configuration',
    'Secrets management guidance',
  ],
  screenshot: 'https://www.mobilecibuilder.com/opengraph-image',
  softwareVersion: '0.1.0',
  author: {
    '@type': 'Organization',
    name: 'Mobile CI Builder',
    url: 'https://www.mobilecibuilder.com',
  },
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <HeroSection />
      <WorkflowBuilder />
      <HowItWorks />
      <BenefitsSection />
      <SupportedFrameworks />
      <FooterSection />
    </main>
  );
}
