import Link from "next/link";

export default function StorageOptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Storage Options</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Configure where and how build artifacts are stored
        </p>
      </div>

      <div>
        <p className="leading-7">
          Build workflows can store artifacts in different locations to make them available for
          download, testing, or deployment. This page explains the available storage options
          and how to configure them.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">GitHub Actions Artifacts</h2>
        <p className="text-muted-foreground">
          Store build artifacts directly in GitHub Actions using the built-in artifacts system
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>Built-in to GitHub Actions - no additional setup required</li>
            <li>Artifacts are automatically linked to workflow runs</li>
            <li>Automatic retention policy based on repository settings</li>
            <li>Secure storage within your GitHub repository</li>
            <li>Size limitations based on your GitHub plan</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Configuration</h3>
          <pre className="overflow-x-auto rounded-lg bg-secondary p-4">
            <code className="text-sm">
{`{
  "kind": "build",
  "options": {
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

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold">How it works</h4>
          <p className="mt-2 text-sm">
            When using GitHub storage, the workflow will:
          </p>
          <ol className="mt-2 ml-4 list-decimal text-sm space-y-1">
            <li>Build the application for the specified platform</li>
            <li>Collect the build artifacts (APK, AAB, IPA files)</li>
            <li>Upload them using the <code>actions/upload-artifact@v4</code> action</li>
            <li>Make them available for download from the workflow run page</li>
          </ol>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Custom Storage Integration</h2>
        <p className="text-muted-foreground">
          Configure custom storage providers for build artifacts
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>Flexible storage options for your specific needs</li>
            <li>Integration with existing infrastructure</li>
            <li>Custom retention policies and access controls</li>
            <li>Support for larger artifacts beyond GitHub limits</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4 space-y-4">
          <h4 className="font-semibold">Implementing Custom Storage</h4>
          <p className="text-sm">
            To implement a custom storage option:
          </p>
          <ol className="ml-4 list-decimal text-sm space-y-1">
            <li>Create a new storage helper in <code>src/helpers/storage.ts</code></li>
            <li>Implement functions for uploading artifacts</li>
            <li>Add your custom storage option to the available options</li>
            <li>Use it in your workflow configuration</li>
          </ol>
          
          <p className="text-sm pt-2">
            See the <Link href="/docs/examples#custom-storage" className="text-primary hover:underline">
              custom storage example
            </Link> for a detailed implementation guide.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Storage Comparison</h2>
        
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Feature</th>
                <th className="px-4 py-2 text-left font-medium">GitHub Artifacts</th>
                <th className="px-4 py-2 text-left font-medium">Custom Storage</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm">Setup complexity</td>
                <td className="px-4 py-2 text-sm">Low (built-in)</td>
                <td className="px-4 py-2 text-sm">Medium-High (custom integration)</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm">Size limits</td>
                <td className="px-4 py-2 text-sm">Based on GitHub plan</td>
                <td className="px-4 py-2 text-sm">Based on storage provider</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm">Retention policy</td>
                <td className="px-4 py-2 text-sm">Fixed (90 days default)</td>
                <td className="px-4 py-2 text-sm">Customizable</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm">Access control</td>
                <td className="px-4 py-2 text-sm">Repository permissions</td>
                <td className="px-4 py-2 text-sm">Provider-specific</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm">Integration with workflow</td>
                <td className="px-4 py-2 text-sm">Automatic</td>
                <td className="px-4 py-2 text-sm">Custom implementation</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm">Best for</td>
                <td className="px-4 py-2 text-sm">Simple projects, quick setup</td>
                <td className="px-4 py-2 text-sm">Complex requirements, larger teams</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-lg bg-muted p-6">
        <h3 className="font-semibold">Accessing Build Artifacts</h3>
        <p className="mt-2 text-sm">
          Regardless of storage option, build artifacts can be referenced in PR comments,
          notifications, or other parts of your workflow. See the
          <Link href="/docs/examples#artifact-links" className="text-primary hover:underline mx-1">
            artifact links example
          </Link>
          for how to create dynamic links to your build artifacts.
        </p>
      </div>
    </div>
  );
}