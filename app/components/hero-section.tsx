"use client"

import { motion } from "framer-motion";
import { FileJson } from "lucide-react";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { PROJECT_NAME, PROJECT_DESCRIPTION, REPO_URL } from "@/config/constants";

export function HeroSection() {
  return (
    <div className="w-full bg-gradient-to-b from-background to-background/80 py-12 md:py-24">
      <div className="container flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 rounded-full bg-muted px-4 py-1 text-sm text-muted-foreground">
            <IconBrandGithub size={14} />
            <span>Open Source</span>
          </div>
        </motion.div>
        
        <motion.h1
          className="mt-6 text-4xl font-bold tracking-tight md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {PROJECT_NAME}
        </motion.h1>
        
        <motion.p
          className="mt-4 max-w-[42rem] text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {PROJECT_DESCRIPTION}
        </motion.p>
        
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button
            size="lg"
            className="h-12 px-8 transition-all hover:scale-105"
            onClick={() => {
              // Scroll to workflow form
              document.getElementById('workflow-builder')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Build My Workflow
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 transition-all hover:scale-105"
            asChild
          >
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <IconBrandGithub className="mr-2 h-5 w-5" />
              View on GitHub
            </a>
          </Button>
        </motion.div>

        
        <motion.div
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            >
              <div className="mb-3 rounded-full bg-primary/10 p-2 w-10 h-10 flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    title: "Optimized for React Native",
    description: "Tailored workflows for React Native projects with best-practice defaults",
    icon: FileJson,
  },
  {
    title: "GitHub Actions Integration",
    description: "Create workflows that run automatically on GitHub with full TypeScript support",
    icon: IconBrandGithub,
  },
  {
    title: "Customizable Configuration",
    description: "Tailor your CI/CD pipeline with flexible options, triggers, and environment settings",
    icon: FileJson,
  },
];