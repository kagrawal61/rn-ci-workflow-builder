export default function ConfigurationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Configuration Reference</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Complete reference for all workflow configuration options
        </p>
      </div>

      <div>
        <p className="leading-7">
          This page documents all configuration options available for the workflow generator.
          You can use these options to customize your workflows to fit your specific requirements.
        </p>
      </div>

      <section className="space-y-4" id="workflow-config">
        <h2 className="text-2xl font-semibold tracking-tight">WorkflowConfig</h2>
        <p className="text-muted-foreground">
          The top-level configuration object for defining a workflow
        </p>
        
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Property</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-left font-medium">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">kind</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">The type of workflow to generate (e.g., "health-check", "build")</td>
                <td className="px-4 py-2 text-sm">Yes</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">options</td>
                <td className="px-4 py-2 font-mono text-sm">WorkflowOptions</td>
                <td className="px-4 py-2 text-sm">Configuration options for the workflow</td>
                <td className="px-4 py-2 text-sm">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4" id="workflow-options">
        <h2 className="text-2xl font-semibold tracking-tight">WorkflowOptions</h2>
        <p className="text-muted-foreground">
          Common configuration options for all workflow types
        </p>
        
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Property</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-left font-medium">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">name</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">The name of the workflow</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">triggers</td>
                <td className="px-4 py-2 font-mono text-sm">TriggerOptions</td>
                <td className="px-4 py-2 text-sm">Configuration for when the workflow should run</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">env</td>
                <td className="px-4 py-2 font-mono text-sm">{`Record<string, string>`}</td>
                <td className="px-4 py-2 text-sm">Environment variables to set for the workflow</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">secrets</td>
                <td className="px-4 py-2 font-mono text-sm">string[]</td>
                <td className="px-4 py-2 text-sm">GitHub secrets to make available in the workflow</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">cache</td>
                <td className="px-4 py-2 font-mono text-sm">CacheConfig</td>
                <td className="px-4 py-2 text-sm">Configuration for caching dependencies</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">runsOn</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">The GitHub Actions runner to use (e.g., "ubuntu-latest")</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">nodeVersions</td>
                <td className="px-4 py-2 font-mono text-sm">number[]</td>
                <td className="px-4 py-2 text-sm">Node.js versions to test against</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">packageManager</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">Package manager to use (e.g., "yarn", "npm")</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4" id="trigger-options">
        <h2 className="text-2xl font-semibold tracking-tight">TriggerOptions</h2>
        <p className="text-muted-foreground">
          Configuration for when a workflow should run
        </p>
        
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Property</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-left font-medium">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">branches</td>
                <td className="px-4 py-2 font-mono text-sm">string[]</td>
                <td className="px-4 py-2 text-sm">Branches that trigger the workflow</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">events</td>
                <td className="px-4 py-2 font-mono text-sm">string[]</td>
                <td className="px-4 py-2 text-sm">Events that trigger the workflow (e.g., "push", "pull_request")</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">paths</td>
                <td className="px-4 py-2 font-mono text-sm">string[]</td>
                <td className="px-4 py-2 text-sm">File paths that trigger the workflow when changed</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">tags</td>
                <td className="px-4 py-2 font-mono text-sm">string[]</td>
                <td className="px-4 py-2 text-sm">Tags that trigger the workflow</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4" id="build-options">
        <h2 className="text-2xl font-semibold tracking-tight" id="build">Build Options</h2>
        <p className="text-muted-foreground">
          Configuration options specific to build workflows
        </p>
        
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Property</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-left font-medium">Required</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">platform</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">The platform to build for (e.g., "android", "ios", "both")</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">variant</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">The build variant (e.g., "debug", "release")</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">storage</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">Where to store build artifacts (e.g., "github")</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">notification</td>
                <td className="px-4 py-2 font-mono text-sm">string</td>
                <td className="px-4 py-2 text-sm">How to notify about builds (e.g., "pr-comment")</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-sm">includeHealthCheck</td>
                <td className="px-4 py-2 font-mono text-sm">boolean</td>
                <td className="px-4 py-2 text-sm">Whether to include health checks before building</td>
                <td className="px-4 py-2 text-sm">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-lg bg-muted p-6">
        <h3 className="font-semibold">Schema Definition</h3>
        <p className="mt-2 text-sm">
          The complete TypeScript type definitions for all configuration options are available in the
          <code className="mx-1">src/types.ts</code> file in the repository.
        </p>
      </div>
    </div>
  );
}