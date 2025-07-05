import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          React Native CI Workflow Builder
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Create optimized CI/CD workflows for your React Native projects with
          our visual builder
        </p>
      </div>

      <div>
        <p className="leading-7">
          Welcome to the React Native CI Workflow Builder! This web application
          simplifies the creation of CI/CD workflows for React Native projects
          through a visual, intuitive interface. Say goodbye to complex YAML
          syntax and hello to a streamlined workflow configuration experience.
        </p>

        <div className="my-6 rounded-lg border bg-muted/40 p-5">
          <h3 className="font-semibold">About This Documentation</h3>
          <p className="mt-2 text-sm">
            This documentation is organized into focused sections to help you
            make the most of the workflow builder:
          </p>
          <ul className="ml-6 mt-2 list-disc space-y-1">
            <li>
              <strong>Getting Started</strong> - Step-by-step guide for new
              users
            </li>
            <li>
              <strong>Core Concepts</strong> - Understanding the workflow
              builder's approach
            </li>
            <li>
              <strong>Workflow Presets</strong> - Available workflow templates
              and their use cases
            </li>
            <li>
              <strong>Configuration</strong> - Options and settings for
              customizing your workflows
            </li>
            <li>
              <strong>Storage Options</strong> - Ways to store and distribute
              your build artifacts
            </li>
            <li>
              <strong>Secrets Management</strong> - Handling sensitive
              information in your workflows
            </li>
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/docs/benefits"
          className="group rounded-lg border-2 border-green-200 bg-green-50 p-4 transition-colors hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:hover:bg-green-900/30"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-800 dark:text-green-200">💰 ROI & Benefits</h2>
            <ArrowRight className="h-5 w-5 text-green-600 transition-colors group-hover:text-green-800 dark:text-green-400 dark:group-hover:text-green-200" />
          </div>
          <p className="text-green-700 dark:text-green-300">
            Quantifiable savings: $2K-6K per project, 95% faster setup, 300-500% ROI
          </p>
        </Link>

        <Link
          href="/docs/getting-started"
          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Getting Started</h2>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
          <p className="text-muted-foreground">
            Learn how to use the web application to create your first workflow
            in minutes
          </p>
        </Link>

        <Link
          href="/docs/workflow-presets"
          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Workflow Types</h2>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
          <p className="text-muted-foreground">
            Explore available workflow types and their specific features
          </p>
        </Link>

        <Link
          href="/docs/configuration"
          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Configuration Options</h2>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
          <p className="text-muted-foreground">
            Detailed guide to all available configuration options in the web app
          </p>
        </Link>

        <Link
          href="/docs/storage-options"
          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Storage Options</h2>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
          <p className="text-muted-foreground">
            Learn about different ways to store and distribute your build
            artifacts
          </p>
        </Link>

        <Link
          href="/docs/secrets-management"
          className="group rounded-lg border p-4 transition-colors hover:bg-accent"
        >
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Secrets Management</h2>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
          <p className="text-muted-foreground">
            How to manage sensitive information for your workflows
          </p>
        </Link>
      </div>

      <div className="rounded-lg border bg-muted/20 p-6">
        <h2 className="mb-4 text-xl font-semibold">Web App Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-4">
            <h3 className="mb-1 font-medium">Visual Configuration</h3>
            <p className="text-sm text-muted-foreground">
              Form-based interface with intuitive controls and tooltips for easy
              workflow configuration
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="mb-1 font-medium">Real-time YAML Preview</h3>
            <p className="text-sm text-muted-foreground">
              See the generated workflow YAML in real-time as you configure your
              workflow
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="mb-1 font-medium">Preset Templates</h3>
            <p className="text-sm text-muted-foreground">
              Pre-configured workflow templates for common CI/CD scenarios
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="mb-1 font-medium">Secrets Summary</h3>
            <p className="text-sm text-muted-foreground">
              Automatic detection and summary of required secrets based on your
              configuration
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="mb-1 font-medium">Multi-Platform Support</h3>
            <p className="text-sm text-muted-foreground">
              Configure workflows for Android, iOS, or both platforms
              simultaneously
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="mb-1 font-medium">Theme Options</h3>
            <p className="text-sm text-muted-foreground">
              Choose between light and dark mode for comfortable workflow
              creation
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
