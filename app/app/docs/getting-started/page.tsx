import { IconCheck } from "@tabler/icons-react";

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Getting Started</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Set up your first workflow in minutes with these simple steps
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">1</span>
            </div>
            <h2 className="text-xl font-semibold">Create a configuration file</h2>
          </div>
          <div className="ml-10">
            <p className="text-muted-foreground">
              Create a new file in your project root called <code>workflow-config.json</code>
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-4">
              <code className="text-sm">
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
      "storage": "github",
      "notification": "pr-comment"
    }
  }
}`}
              </code>
            </pre>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">2</span>
            </div>
            <h2 className="text-xl font-semibold">Generate the workflow</h2>
          </div>
          <div className="ml-10">
            <p className="text-muted-foreground">
              Generate your GitHub Actions workflow using the configuration file
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-4">
              <code className="text-sm">
{`npx @your-org/rn-workflow-builder --config workflow-config.json --output .github/workflows/android-build.yml`}
              </code>
            </pre>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">3</span>
            </div>
            <h2 className="text-xl font-semibold">Review and commit</h2>
          </div>
          <div className="ml-10">
            <p className="text-muted-foreground">
              Review the generated workflow file and commit it to your repository
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-4">
              <code className="text-sm">
{`git add .github/workflows/android-build.yml
git commit -m "Add Android build workflow"
git push`}
              </code>
            </pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">What's next?</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <IconCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Explore <a href="/docs/workflow-presets" className="text-primary hover:underline">workflow presets</a> for other common CI/CD scenarios
            </span>
          </li>
          <li className="flex items-start gap-2">
            <IconCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Learn about <a href="/docs/configuration" className="text-primary hover:underline">configuration options</a> to customize your workflows
            </span>
          </li>
          <li className="flex items-start gap-2">
            <IconCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Set up <a href="/docs/secrets-management" className="text-primary hover:underline">secrets management</a> for secure workflow execution
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}