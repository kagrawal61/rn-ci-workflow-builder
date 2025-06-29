export default function SecretsManagementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Secrets Management</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Securely handle sensitive information in your workflows
        </p>
      </div>

      <div>
        <p className="leading-7">
          CI/CD workflows often require access to sensitive information such as API keys, 
          signing certificates, and deployment credentials. This page explains how to 
          securely manage these secrets in your workflow configurations.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">GitHub Actions Secrets</h2>
        <p className="text-muted-foreground">
          GitHub Actions provides a secure way to store sensitive information as secrets
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">How GitHub Secrets Work</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>Secrets are encrypted environment variables stored in your GitHub repository</li>
            <li>They are only exposed to selected GitHub Actions workflows</li>
            <li>They are masked in logs (hidden from output)</li>
            <li>They can be scoped to repositories, environments, or organizations</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Setting Up Secrets</h3>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Go to your GitHub repository</li>
            <li>Navigate to Settings → Secrets and variables → Actions</li>
            <li>Click "New repository secret"</li>
            <li>Enter the name and value for your secret</li>
            <li>Click "Add secret"</li>
          </ol>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold">Secret Naming Conventions</h4>
          <p className="mt-2 text-sm">
            We recommend using a consistent naming convention for secrets:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
            <li><code>ANDROID_KEYSTORE_BASE64</code>: Android signing keystore (Base64 encoded)</li>
            <li><code>ANDROID_KEYSTORE_PASSWORD</code>: Android keystore password</li>
            <li><code>ANDROID_KEY_ALIAS</code>: Android signing key alias</li>
            <li><code>ANDROID_KEY_PASSWORD</code>: Android signing key password</li>
            <li><code>IOS_DISTRIBUTION_CERT_BASE64</code>: iOS distribution certificate (Base64 encoded)</li>
            <li><code>IOS_PROVISIONING_PROFILE_BASE64</code>: iOS provisioning profile (Base64 encoded)</li>
            <li><code>IOS_CERT_PASSWORD</code>: iOS certificate password</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Using Secrets in Workflows</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Referencing Secrets</h3>
          <p className="text-muted-foreground">
            To use secrets in your workflow, reference them in your configuration:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-4">
            <code className="text-sm">
{`{
  "kind": "build",
  "options": {
    "secrets": [
      "ANDROID_KEYSTORE_BASE64",
      "ANDROID_KEYSTORE_PASSWORD",
      "ANDROID_KEY_ALIAS",
      "ANDROID_KEY_PASSWORD"
    ],
    "build": {
      "platform": "android",
      "variant": "release"
    }
  }
}`}
            </code>
          </pre>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">How It Works</h3>
          <p className="text-muted-foreground">
            When you include secrets in your workflow configuration:
          </p>
          <ol className="ml-6 list-decimal space-y-2">
            <li>The workflow generator adds the secrets to the workflow YAML</li>
            <li>GitHub Actions makes them available as environment variables during workflow execution</li>
            <li>Your build steps can access them securely</li>
          </ol>
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="font-semibold">Generated YAML Example</h4>
          <pre className="mt-2 overflow-x-auto bg-muted p-2 text-sm">
            <code>
{`env:
  ANDROID_KEYSTORE_BASE64: \${{ secrets.ANDROID_KEYSTORE_BASE64 }}
  ANDROID_KEYSTORE_PASSWORD: \${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
  ANDROID_KEY_ALIAS: \${{ secrets.ANDROID_KEY_ALIAS }}
  ANDROID_KEY_PASSWORD: \${{ secrets.ANDROID_KEY_PASSWORD }}`}
            </code>
          </pre>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Required Secrets by Platform</h2>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Platform</th>
                <th className="px-4 py-2 text-left font-medium">Required Secrets</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm" rowSpan={4}>Android</td>
                <td className="px-4 py-2 font-mono text-xs">ANDROID_KEYSTORE_BASE64</td>
                <td className="px-4 py-2 text-sm">Base64-encoded keystore file for signing APKs/AABs</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-xs">ANDROID_KEYSTORE_PASSWORD</td>
                <td className="px-4 py-2 text-sm">Password for the keystore file</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-xs">ANDROID_KEY_ALIAS</td>
                <td className="px-4 py-2 text-sm">Alias for the signing key in the keystore</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-xs">ANDROID_KEY_PASSWORD</td>
                <td className="px-4 py-2 text-sm">Password for the signing key</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 text-sm" rowSpan={3}>iOS</td>
                <td className="px-4 py-2 font-mono text-xs">IOS_DISTRIBUTION_CERT_BASE64</td>
                <td className="px-4 py-2 text-sm">Base64-encoded distribution certificate (.p12)</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-xs">IOS_PROVISIONING_PROFILE_BASE64</td>
                <td className="px-4 py-2 text-sm">Base64-encoded provisioning profile (.mobileprovision)</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-mono text-xs">IOS_CERT_PASSWORD</td>
                <td className="px-4 py-2 text-sm">Password for the distribution certificate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="rounded-lg bg-muted p-6">
        <h3 className="font-semibold">Security Best Practices</h3>
        <ul className="mt-2 ml-4 list-disc text-sm space-y-2">
          <li>Never hardcode secrets in workflow configuration files</li>
          <li>Limit secret access to only the workflows that need them</li>
          <li>Rotate secrets regularly, especially for production environments</li>
          <li>Use environment-specific secrets for staging, testing, and production</li>
          <li>Review GitHub Actions logs to ensure secrets are properly masked</li>
          <li>Use organization-level secrets for shared credentials</li>
        </ul>
      </div>
    </div>
  );
}