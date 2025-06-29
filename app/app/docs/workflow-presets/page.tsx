import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkflowPresetsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Workflow Presets</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Pre-configured workflows for common React Native CI/CD scenarios
        </p>
      </div>

      <div>
        <p className="leading-7">
          Workflow presets provide ready-to-use configurations for common CI/CD scenarios.
          Each preset is designed to follow best practices for React Native projects and
          can be customized to fit your specific requirements.
        </p>
      </div>

      <Tabs defaultValue="health-check">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="health-check">Health Check</TabsTrigger>
          <TabsTrigger value="build">Build</TabsTrigger>
        </TabsList>
        
        <TabsContent value="health-check" className="space-y-6 mt-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Health Check Workflow</h2>
            <p className="text-muted-foreground">
              Runs TypeScript checks, linting, formatting, and tests to ensure code quality
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Features</h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>TypeScript type checking</li>
              <li>ESLint code linting</li>
              <li>Prettier code formatting check</li>
              <li>Jest unit tests</li>
              <li>Configurable Node.js versions</li>
              <li>Optimized dependency caching</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Example Configuration</h3>
            <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
              <code className="text-sm">
{`{
  "kind": "health-check",
  "options": {
    "name": "React Native Health Check",
    "triggers": {
      "branches": ["main", "develop"],
      "events": ["push", "pull_request"]
    },
    "nodeVersions": [18, 20],
    "packageManager": "yarn"
  }
}`}
              </code>
            </pre>
          </div>
          
          <div>
            <Link href="/docs/configuration#health-check" className="text-primary hover:underline">
              View full configuration options →
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="build" className="space-y-6 mt-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Build Workflow</h2>
            <p className="text-muted-foreground">
              Builds Android and/or iOS applications with configurable variants and storage options
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Key Features</h3>
            <ul className="ml-6 list-disc space-y-2">
              <li>Android and/or iOS builds</li>
              <li>Configurable build variants (debug, release)</li>
              <li>Artifact storage options (GitHub, custom)</li>
              <li>Build notifications (PR comments, custom)</li>
              <li>Optional health checks integration</li>
              <li>Optimized dependency and build caching</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Example Configuration</h3>
            <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
              <code className="text-sm">
{`{
  "kind": "build",
  "options": {
    "name": "React Native App Build",
    "triggers": {
      "branches": ["main", "develop"],
      "events": ["push", "pull_request"]
    },
    "build": {
      "platform": "both",
      "variant": "release",
      "storage": "github",
      "notification": "pr-comment",
      "includeHealthCheck": true
    }
  }
}`}
              </code>
            </pre>
          </div>
          
          <div>
            <Link href="/docs/configuration#build" className="text-primary hover:underline">
              View full configuration options →
            </Link>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border p-4">
        <h3 className="font-semibold">Extending Presets</h3>
        <p className="mt-2 text-sm">
          All presets can be customized to fit your specific requirements. You can override default options,
          add custom environment variables, and configure secrets to be used in your workflows.
        </p>
        <p className="mt-2 text-sm">
          See the <Link href="/docs/configuration" className="text-primary hover:underline">configuration reference</Link> for 
          all available options.
        </p>
      </div>
    </div>
  );
}