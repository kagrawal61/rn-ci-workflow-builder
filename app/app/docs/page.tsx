import Link from "next/link";
import { IconArrowRight, IconBook, IconCode, IconSettings, IconStack } from "@tabler/icons-react";
import { REPO_URL } from "@/config/constants";

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Learn how to generate optimized GitHub Actions workflows for your React Native CI/CD pipeline.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/docs/getting-started"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary"
        >
          <div className="flex items-center gap-4">
            <IconBook className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                Quick setup guide to generate your first workflow
              </p>
            </div>
          </div>
          <IconArrowRight className="absolute bottom-4 right-4 h-5 w-5 opacity-0 transition-all group-hover:opacity-100" />
        </Link>

        <Link
          href="/docs/workflow-presets"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary"
        >
          <div className="flex items-center gap-4">
            <IconStack className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Workflow Presets</h3>
              <p className="text-sm text-muted-foreground">
                Pre-configured workflows for common scenarios
              </p>
            </div>
          </div>
          <IconArrowRight className="absolute bottom-4 right-4 h-5 w-5 opacity-0 transition-all group-hover:opacity-100" />
        </Link>

        <Link
          href="/docs/configuration"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary"
        >
          <div className="flex items-center gap-4">
            <IconSettings className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Complete reference for all configuration options
              </p>
            </div>
          </div>
          <IconArrowRight className="absolute bottom-4 right-4 h-5 w-5 opacity-0 transition-all group-hover:opacity-100" />
        </Link>

        <Link
          href="/docs/examples"
          className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary"
        >
          <div className="flex items-center gap-4">
            <IconCode className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Examples & Recipes</h3>
              <p className="text-sm text-muted-foreground">
                Ready-to-use workflow configurations
              </p>
            </div>
          </div>
          <IconArrowRight className="absolute bottom-4 right-4 h-5 w-5 opacity-0 transition-all group-hover:opacity-100" />
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Key Features</h2>
        <ul className="ml-6 list-disc space-y-2">
          <li>Pre-configured workflows for health checks and builds</li>
          <li>Platform-specific configurations for Android and iOS</li>
          <li>Optimized caching strategies for faster builds</li>
          <li>Storage integration options for build artifacts</li>
          <li>Secure secrets management for sensitive information</li>
          <li>Extensible architecture for custom workflows</li>
        </ul>
      </div>
      
      <div className="rounded-lg bg-muted p-6">
        <h3 className="font-semibold">Getting Help</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          If you need assistance or want to report issues, please visit our{" "}
          <Link href={REPO_URL} className="text-primary hover:underline">
            GitHub repository
          </Link>
          .
        </p>
      </div>
    </div>
  );
}