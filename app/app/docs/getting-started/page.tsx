import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Getting Started</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Set up your first CI/CD workflow for your React Native app in minutes
        </p>
      </div>

      <div>
        <p className="leading-7">
          This step-by-step guide walks you through creating your first workflow using the web interface. Unlike the 
          <Link href="/docs/core-concepts" className="text-primary hover:underline">Core Concepts</Link> section that explains 
          the underlying principles, or the <Link href="/docs/configuration" className="text-primary hover:underline">Configuration Reference</Link> 
          that details all available options, this guide focuses on practical, hands-on steps for new users.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">1</span>
            </div>
            <h2 className="text-xl font-semibold">Access the Web App</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              The React Native CI Workflow Builder is available as a web application that you can access directly in your browser:
            </p>
            <div className="flex flex-col md:flex-row gap-6 items-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
              <div className="rounded-lg overflow-hidden shadow-lg bg-card w-full md:w-1/2 aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-70 z-10"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-3">React Native CI Workflow Builder</h3>
                    <Link href="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md">
                      Open Web App <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-3">
                <h3 className="font-semibold text-lg">Create CI/CD Workflows Visually</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Intuitive form-based interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Real-time YAML preview</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Automatic secret detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Workflow validation</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground mt-3">
                  <span className="font-medium">Tip:</span> Bookmark the web app for quick access whenever you need to create workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">2</span>
            </div>
            <h2 className="text-xl font-semibold">Choose a workflow type</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Decide which type of workflow you need for your project:
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold">Static Analysis Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Runs TypeScript checks, linting, formatting, and unit tests to ensure code quality
                </p>
                <p className="mt-2 text-xs font-medium">Recommended for: Daily development, PR validation</p>
              </div>
              
              <div className="rounded-lg border p-4 hover:border-primary transition-colors">
                <h3 className="font-semibold">Build Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Builds your app for Android and/or iOS and can distribute artifacts to various storage options
                </p>
                <p className="mt-2 text-xs font-medium">Recommended for: Testing builds, releases, distribution</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">3</span>
            </div>
            <h2 className="text-xl font-semibold">Configure Your Workflow</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Use the web app's intuitive form interface to configure your workflow:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-semibold mb-2">Basic Information</h4>
                <ul className="text-sm space-y-1 list-disc ml-4">
                  <li>Select workflow type (Static Analysis or Build)</li>
                  <li>Enter custom workflow name</li>
                  <li>Choose Node.js version</li>
                  <li>Select package manager (npm or yarn)</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-semibold mb-2">Trigger Configuration</h4>
                <ul className="text-sm space-y-1 list-disc ml-4">
                  <li>Select trigger events (push, pull request)</li>
                  <li>Specify target branches</li>
                  <li>Add path filters if needed</li>
                  <li>Enable manual workflow dispatch</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-muted/40">
              <h4 className="text-sm font-semibold">Real-time YAML Preview</h4>
              <p className="mt-1 text-sm">
                As you make changes in the form, the web app automatically updates the YAML preview on the right side of the screen, showing you exactly what will be generated.  
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">4</span>
            </div>
            <h2 className="text-xl font-semibold">Workflow-Specific Options</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Based on your selected workflow type, configure additional options:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-semibold mb-2">Static Analysis Options</h4>
                <ul className="text-sm space-y-1 list-disc ml-4">
                  <li>Enable/disable TypeScript checks</li>
                  <li>Configure ESLint options</li>
                  <li>Set up Jest test settings</li>
                  <li>Add Prettier formatting checks</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="text-sm font-semibold mb-2">Build Options</h4>
                <ul className="text-sm space-y-1 list-disc ml-4">
                  <li>Select platform (Android, iOS, both)</li>
                  <li>Choose build variant (debug, release)</li>
                  <li>Configure artifact storage location</li>
                  <li>Set up build notifications</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-muted/40">
              <p className="text-sm">
                <span className="font-medium">Automatic Secret Detection:</span> The web app automatically detects and lists any required secrets based on your configuration choices, making it easy to set up your repository properly.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">5</span>
            </div>
            <h2 className="text-xl font-semibold">Generate and Download</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Once you've configured your workflow, you can preview and download the generated YAML:  
            </p>
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-semibold mb-2">Preview and Download</h4>
              <ol className="text-sm space-y-2 list-decimal ml-4">
                <li>Review the generated YAML in the preview panel</li>
                <li>Check the list of required secrets (if any)</li>
                <li>Click the <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">Download YAML</span> button to save the workflow file</li>
                <li>Save the file to your project's <span className="font-mono text-xs">.github/workflows/</span> directory</li>
              </ol>
            </div>
            <div className="rounded-lg border p-4 bg-muted/40">
              <p className="text-sm">
                <span className="font-medium">GitHub Integration:</span> After downloading, commit the workflow file to your GitHub repository. Once pushed, your workflow will run automatically based on the triggers you configured. You can view workflow runs in the "Actions" tab of your GitHub repository.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Continue Your Learning</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Understand the <Link href="/docs/core-concepts" className="text-primary hover:underline">core concepts</Link> behind the workflow builder
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Review available <Link href="/docs/workflow-presets" className="text-primary hover:underline">workflow presets</Link> and their specific use cases
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Learn about advanced <Link href="/docs/configuration" className="text-primary hover:underline">configuration options</Link> for fine-tuning workflows
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span>
              Explore <Link href="/docs/storage-options" className="text-primary hover:underline">storage options</Link> for distributing your build artifacts
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg bg-muted p-5">
        <h3 className="font-semibold mb-2">Having trouble?</h3>
        <p className="text-sm">
          If you encounter any issues setting up your workflow, refer to the configuration documentation or contact support.
        </p>
      </div>
    </div>
  );
}