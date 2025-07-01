// import { IconArrowRight } from "@tabler/icons-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CoreConceptsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Core Concepts</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Understanding the fundamental concepts behind the workflow generator
        </p>
      </div>

      <div className="leading-7">
        <p>
          While the <Link href="/docs/getting-started" className="text-primary hover:underline">Getting Started</Link> guide 
          shows you how to use the application and <Link href="/docs/configuration" className="text-primary hover:underline">Configuration</Link> 
          covers specific options, this section explains the underlying concepts and design principles of the workflow builder.
          Understanding these concepts will help you make better decisions when creating your workflows.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight" id="workflow-generation">Workflow Generation Process</h2>
        <p className="text-muted-foreground">
          How your workflow selections are transformed into ready-to-use GitHub Actions workflows
        </p>

        <div className="space-y-3 rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">1</span>
            </div>
            <div>
              <h3 className="font-semibold">Form-Based Configuration</h3>
              <p className="text-sm text-muted-foreground">
                You provide workflow details through the web app's intuitive form interface
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <ArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">2</span>
            </div>
            <div>
              <h3 className="font-semibold">Template Application</h3>
              <p className="text-sm text-muted-foreground">
                The web app applies your selections to the appropriate workflow template
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <ArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">3</span>
            </div>
            <div>
              <h3 className="font-semibold">Real-Time Preview</h3>
              <p className="text-sm text-muted-foreground">
                You see your workflow YAML update instantly as you make configuration choices
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <ArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">4</span>
            </div>
            <div>
              <h3 className="font-semibold">Secret Detection</h3>
              <p className="text-sm text-muted-foreground">
                Required secrets are automatically identified based on your configuration choices
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <ArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">5</span>
            </div>
            <div>
              <h3 className="font-semibold">Workflow Download</h3>
              <p className="text-sm text-muted-foreground">
                You download the final YAML file ready to use in your GitHub repository
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight" id="preset-system">Preset System</h2>
        <p className="text-muted-foreground">
          Presets provide template workflows for common CI/CD scenarios
        </p>
        
        <div className="space-y-4">
          <p>
            Workflow presets are ready-to-use templates tailored for specific CI/CD needs. Each preset:
          </p>
          
          <ul className="ml-6 list-disc space-y-2">
            <li>Addresses a specific CI/CD need (code quality, builds, etc.)</li>
            <li>Provides sensible defaults for quick setup</li>
            <li>Follows industry best practices for React Native</li>
            <li>Is fully customizable through the web interface</li>
            <li>Generates optimized workflows for your specific needs</li>
          </ul>
          
          <p className="mt-2">
            Currently available presets include:
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">Static Analysis</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Runs TypeScript checks, linting, formatting, and tests
              </p>
              <Link
                href="/docs/workflow-presets#static-analysis"
                className="mt-2 inline-flex items-center text-sm text-primary hover:underline"
              >
                Learn more
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">Build</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Builds Android and/or iOS applications with configurable options
              </p>
              <Link
                href="/docs/workflow-presets#build"
                className="mt-2 inline-flex items-center text-sm text-primary hover:underline"
              >
                Learn more
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight" id="configuration-system">Configuration System</h2>
        <p className="text-muted-foreground">
          The flexible configuration system allows customization of workflows
        </p>
        
        <div className="space-y-4">
          <p>
            The web app provides an intuitive configuration interface that:
          </p>
          
          <ul className="ml-6 list-disc space-y-2">
            <li>Presents clear options with helpful tooltips</li>
            <li>Uses sensible defaults to get you started quickly</li>
            <li>Provides full customization when you need it</li>
            <li>Manages environment variables and secrets securely</li>
            <li>Validates your choices to prevent configuration errors</li>
          </ul>
          
          <div className="rounded-lg border p-4 bg-muted/30">
            <h4 className="font-semibold">Key Configuration Categories</h4>
            <div className="grid gap-2 sm:grid-cols-2 mt-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-sm">Basic Settings</p>
                <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                  <li>Workflow name</li>
                  <li>Node.js version</li>
                  <li>Package manager</li>
                </ul>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium text-sm">Trigger Options</p>
                <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                  <li>Trigger events (push, PR)</li>
                  <li>Branch filters</li>
                  <li>Path filters</li>
                </ul>
              </div>
            </div>
          </div>
          
          <p>
            See the <Link href="/docs/configuration" className="text-primary hover:underline">Configuration Reference</Link> for
            detailed documentation of all available options.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight" id="github-actions">GitHub Actions Integration</h2>
        <p className="text-muted-foreground">
          The workflow generator outputs YAML files compatible with GitHub Actions
        </p>
        
        <div className="space-y-4">
          <p>
            The workflows you create are ready to use with GitHub Actions without any additional configuration:
          </p>
          
          <ul className="ml-6 list-disc space-y-2">
            <li>Download and add to your repository with just a few clicks</li>
            <li>Leverage industry-standard actions for reliability</li>
            <li>Benefit from optimized caching for faster builds</li>
            <li>Get parallel execution when possible for better performance</li>
            <li>Utilize secure secret management following GitHub best practices</li>
          </ul>
          
          <div className="rounded-lg border p-4 bg-muted/30">
            <h4 className="font-semibold mb-2">Using Your Workflow</h4>
            <ol className="ml-4 list-decimal text-sm space-y-2">
              <li>Download the YAML file from the web app</li>
              <li>Add it to the <code>.github/workflows</code> directory in your repository</li>
              <li>Commit and push to your GitHub repository</li>
              <li>GitHub will automatically run your workflow based on the triggers you configured</li>
              <li>View results in the Actions tab of your GitHub repository</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight" id="workflows-in-action">Workflows in Action</h2>
        <p className="text-muted-foreground">
          How your generated workflows help streamline your React Native development process
        </p>
        
        <div className="space-y-4">
          <p>
            The workflows you create deliver tangible benefits to your development process:
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Code Quality Assurance</h3>
              <ul className="ml-4 list-disc text-sm space-y-1">
                <li>Automated type checking catches errors early</li>
                <li>Consistent code style through linting checks</li>
                <li>Unit tests validate your code's behavior</li>
                <li>Prevents problematic code from reaching your main branch</li>
              </ul>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Efficient Build Process</h3>
              <ul className="ml-4 list-disc text-sm space-y-1">
                <li>Automated builds triggered by your code changes</li>
                <li>Consistent build environment for reliable results</li>
                <li>Smart caching for faster build times</li>
                <li>Build artifacts stored where you need them</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 rounded-lg bg-muted/30 p-4">
            <h4 className="font-semibold mb-2">Continuous Improvement</h4>
            <p className="text-sm">
              We're constantly adding new features and improvements to our workflow templates based on industry best practices and user feedback.
              Check back regularly for updates that can further enhance your CI/CD pipeline.
            </p>
          </div>
        </div>
      </section>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
        <h3 className="font-semibold">Next Steps</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/workflow-presets"
            className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-primary hover:bg-accent"
          >
            <h4 className="font-semibold">Explore Workflow Presets</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Learn about available workflow templates and their options
            </p>
          </Link>
          <Link
            href="/docs/configuration"
            className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:border-primary hover:bg-accent"
          >
            <h4 className="font-semibold">Configuration Reference</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Detailed documentation of all configuration options
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}