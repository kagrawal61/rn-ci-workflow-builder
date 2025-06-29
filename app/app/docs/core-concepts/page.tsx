import { IconArrowRight } from "@tabler/icons-react";
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
          The React Native CI/CD Workflow Builder is designed to generate optimized GitHub Actions
          workflows for your React Native projects. To use it effectively, it helps to understand
          the core concepts that drive its design and functionality.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight" id="workflow-generation">Workflow Generation Process</h2>
        <p className="text-muted-foreground">
          How configurations are transformed into GitHub Actions workflows
        </p>

        <div className="space-y-3 rounded-lg border p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">1</span>
            </div>
            <div>
              <h3 className="font-semibold">Configuration Input</h3>
              <p className="text-sm text-muted-foreground">
                Users provide a workflow configuration in JSON format, specifying the workflow kind and options
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <IconArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">2</span>
            </div>
            <div>
              <h3 className="font-semibold">Preset Selection</h3>
              <p className="text-sm text-muted-foreground">
                The generator selects the appropriate preset builder function based on the workflow kind
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <IconArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">3</span>
            </div>
            <div>
              <h3 className="font-semibold">Workflow Object Creation</h3>
              <p className="text-sm text-muted-foreground">
                The builder creates a structured workflow object with jobs, steps, and configurations
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <IconArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">4</span>
            </div>
            <div>
              <h3 className="font-semibold">YAML Serialization</h3>
              <p className="text-sm text-muted-foreground">
                The workflow object is serialized to YAML format using js-yaml
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <IconArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">5</span>
            </div>
            <div>
              <h3 className="font-semibold">Secret Replacement</h3>
              <p className="text-sm text-muted-foreground">
                Placeholders for secrets are replaced with GitHub Actions secret syntax
              </p>
            </div>
          </div>
          
          <div className="ml-4 mt-2 border-l-2 border-muted pl-4">
            <IconArrowRight className="h-4 w-4 -rotate-90 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">6</span>
            </div>
            <div>
              <h3 className="font-semibold">File Output</h3>
              <p className="text-sm text-muted-foreground">
                The resulting YAML is either output to console or written to a file
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
            The preset system is the heart of the workflow generator. Each preset is a function that:
          </p>
          
          <ul className="ml-6 list-disc space-y-2">
            <li>Takes <code>WorkflowOptions</code> as input</li>
            <li>Applies reasonable defaults for missing options</li>
            <li>Generates a complete GitHub Actions workflow structure</li>
            <li>Follows best practices for React Native CI/CD</li>
            <li>Can be customized through configuration options</li>
          </ul>
          
          <p className="mt-2">
            Currently available presets include:
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold">Health Check</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Runs TypeScript checks, linting, formatting, and tests
              </p>
              <Link
                href="/docs/workflow-presets#health-check"
                className="mt-2 inline-flex items-center text-sm text-primary hover:underline"
              >
                Learn more
                <IconArrowRight className="ml-1 h-3 w-3" />
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
                <IconArrowRight className="ml-1 h-3 w-3" />
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
            Workflows are configured using a typed configuration system that:
          </p>
          
          <ul className="ml-6 list-disc space-y-2">
            <li>Provides type safety through TypeScript interfaces</li>
            <li>Uses reasonable defaults for optional parameters</li>
            <li>Allows for extensive customization</li>
            <li>Supports environment variables and secrets</li>
          </ul>
          
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-semibold">Example Configuration</h4>
            <pre className="mt-2 overflow-x-auto text-sm">
              <code>
{`{
  "kind": "build",
  "options": {
    "name": "React Native Build",
    "triggers": {
      "branches": ["main", "develop"],
      "events": ["push", "pull_request"]
    },
    "build": {
      "platform": "android",
      "variant": "release",
      "storage": "github"
    }
  }
}`}
              </code>
            </pre>
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
            The generated workflows are designed to work seamlessly with GitHub Actions:
          </p>
          
          <ul className="ml-6 list-disc space-y-2">
            <li>Uses standard GitHub Actions syntax and features</li>
            <li>Incorporates popular and reliable actions from the ecosystem</li>
            <li>Configures caching for faster builds</li>
            <li>Sets up proper job dependencies and parallel execution</li>
            <li>Handles secrets securely according to GitHub best practices</li>
          </ul>
          
          <div className="rounded-lg border p-4">
            <p className="text-sm">
              Generated workflows should be placed in the <code>.github/workflows</code> directory of your
              React Native project repository. GitHub will automatically detect and run these workflows
              based on the configured triggers.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight" id="extension">Extension Points</h2>
        <p className="text-muted-foreground">
          The workflow generator is designed to be extended with new presets and functionality
        </p>
        
        <div className="space-y-4">
          <p>
            To add new workflow types:
          </p>
          
          <ol className="ml-6 list-decimal space-y-2">
            <li>Create a new preset file in <code>src/presets/</code></li>
            <li>Add the preset builder function to the <code>builders</code> map in <code>generator.ts</code></li>
            <li>Define any new types needed in <code>types.ts</code></li>
            <li>Create sample configuration files in <code>samples/</code></li>
          </ol>
          
          <div className="mt-4 rounded-lg bg-muted p-4">
            <h4 className="font-semibold">Advanced Usage</h4>
            <p className="mt-2 text-sm">
              For more advanced customization, you can:
            </p>
            <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
              <li>Create custom helper functions in <code>src/helpers/</code></li>
              <li>Extend the validation system in <code>src/validation/</code></li>
              <li>Add new storage providers in <code>src/helpers/storage.ts</code></li>
              <li>Implement custom notification options in <code>src/helpers/notifications.ts</code></li>
            </ul>
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