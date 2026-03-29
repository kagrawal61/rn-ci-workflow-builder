'use client';

import { motion } from 'framer-motion';
import { Download, Settings2, Zap } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Settings2,
    title: 'Configure',
    description:
      'Select your CI platform, target platforms (Android/iOS), package manager, triggers, and build options through the intuitive form.',
    color: 'blue',
  },
  {
    number: '02',
    icon: Zap,
    title: 'Generate',
    description:
      'Your workflow YAML is generated instantly and previewed in real time — no waiting, no sign-up required.',
    color: 'green',
  },
  {
    number: '03',
    icon: Download,
    title: 'Download & Deploy',
    description:
      "Download the ready-to-use YAML file, drop it into your repository's `.github/workflows` directory, and you're done.",
    color: 'purple',
  },
];

export function HowItWorks() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            From zero to a working CI/CD pipeline in three steps
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connector line between circle centres (desktop only) */}
          <div
            className="absolute hidden h-px bg-border md:block"
            style={{
              top: '48px',
              left: 'calc(100% / 6)',
              right: 'calc(100% / 6)',
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: 'easeOut' }}
            >
              {/* Step circle */}
              <div
                className={`relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 bg-background ${
                  step.color === 'blue'
                    ? 'border-blue-500/40 bg-blue-500/5'
                    : step.color === 'green'
                      ? 'border-green-500/40 bg-green-500/5'
                      : 'border-purple-500/40 bg-purple-500/5'
                }`}
              >
                <step.icon
                  className={`h-8 w-8 ${
                    step.color === 'blue'
                      ? 'text-blue-500'
                      : step.color === 'green'
                        ? 'text-green-500'
                        : 'text-purple-500'
                  }`}
                />
                <span className="mt-1 text-xs font-semibold text-muted-foreground">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
