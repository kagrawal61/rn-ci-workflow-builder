'use client';

import { PROJECT_DESCRIPTION, PROJECT_NAME } from "@/config/constants";
import { motion } from "framer-motion";
import { Clock, Code, FileJson, Github, LayoutGrid, Rocket, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <div className="w-full bg-gradient-to-b from-background to-background/80 py-12 md:py-24">
      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center justify-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              <div className="flex h-3.5 w-3.5 items-center justify-center">
                <Clock size={14} />
              </div>
              <span>Open Source</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-300">
              <Code className="h-3.5 w-3.5" />
              <span>Built for Developers</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              <Zap className="h-3.5 w-3.5" />
              <span>Fast & Reliable</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="mt-6 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-primary dark:to-indigo-400 md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          whileInView={{ scale: [0.95, 1] }}
          viewport={{ once: true }}
        >
          {PROJECT_NAME}
        </motion.h1>

        <motion.p
          className="mt-4 max-w-[42rem] text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          whileInView={{ scale: [0.98, 1] }}
          viewport={{ once: true }}
        >
          {PROJECT_DESCRIPTION} <span className="font-semibold text-green-500">Generate production-ready workflows instantly </span> and  <span className="font-semibold text-primary">save $2,000–$6,000 per project</span> — no more time wasted on manual configuration.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          whileInView={{ scale: [0.95, 1] }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            className="h-12 px-8 transition-all hover:scale-105"
            onClick={() => {
              // Scroll to workflow form
              document
                .getElementById('workflow-builder')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Build My Workflow
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="h-12 px-8 transition-all hover:scale-105"
            asChild
          >
            <a href="/docs">Read Documentation</a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 transition-all hover:scale-105 flex items-center gap-2"
            asChild
          >
            <a href="https://github.com/kagrawal61/rn-ci-workflow-builder" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </Button>
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className={`rounded-lg border bg-card p-6 shadow-sm transition-all hover:scale-105 hover:border-${feature.color}-500/50 hover:shadow-md`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + i * 0.1,
                ease: 'easeOut',
              }}
              whileHover={{ y: -5 }}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${
                feature.color === 'blue' ? 'from-blue-200/60 to-blue-400/20 dark:from-blue-900/30 dark:to-blue-800/20' : 
                feature.color === 'green' ? 'from-green-200/60 to-green-400/20 dark:from-green-900/30 dark:to-green-800/20' : 
                'from-purple-200/60 to-purple-400/20 dark:from-purple-900/30 dark:to-purple-800/20'
              } p-3`}>
                <feature.icon className={`h-6 w-6 ${
                  feature.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 
                  feature.color === 'green' ? 'text-green-600 dark:text-green-400' : 
                  'text-purple-600 dark:text-purple-400'
                }`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${
                feature.color === 'blue' ? 'from-blue-500 to-blue-400' : 
                feature.color === 'green' ? 'from-green-500 to-green-400' : 
                'from-purple-500 to-purple-400'
              }`}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'Optimized for React Native',
    description:
      'Tailored workflows for React Native projects with best-practice defaults and optimized performance',
    icon: FileJson,
    color: 'blue',
  },
  {
    title: 'CI/CD Integration',
    description:
      'Create workflows that run automatically with full TypeScript support and real-time feedback',
    icon: LayoutGrid,
    color: 'green',
  },
  {
    title: 'Customizable Configuration',
    description:
      'Tailor your CI/CD pipeline with flexible options, triggers, and environment settings that scale with your team',
    icon: Rocket,
    color: 'purple',
  },
];
