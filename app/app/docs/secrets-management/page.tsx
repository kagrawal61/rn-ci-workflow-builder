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
          signing certificates, and deployment credentials. This guide explains how to 
          securely manage these secrets in your workflow configurations.
        </p>
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Understanding Secrets in CI/CD</h2>
        
        <p className="leading-7">
          Secrets are sensitive values that should never be committed to your repository but are required for your CI/CD workflows.
          These include API keys, signing keys, access tokens, and other credentials.
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Why Secrets Management Matters</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>Prevents exposure of sensitive information in your repository</li>
            <li>Enables secure automation of deployment and distribution</li>
            <li>Allows different team members to run workflows without sharing credentials</li>
            <li>Supports different environments (development, staging, production)</li>
          </ul>
        </div>
      </section>

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
          <h3 className="text-lg font-semibold">Setting Up Secrets in GitHub Actions</h3>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Go to your GitHub repository</li>
            <li>Navigate to Settings → Secrets and variables → Actions</li>
            <li>Click "New repository secret"</li>
            <li>Enter the name and value for your secret</li>
            <li>Click "Add secret"</li>
          </ol>
          <p className="mt-2 text-sm">
            For more details, see the <a href="https://docs.github.com/en/actions/security-guides/encrypted-secrets" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">GitHub Actions encrypted secrets documentation</a>.
          </p>
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
        <h2 className="text-2xl font-semibold tracking-tight">Bitrise Secrets</h2>
        <p className="text-muted-foreground">
          Bitrise provides multiple ways to securely manage sensitive information
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">How Bitrise Secrets Work</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>Secrets can be managed as Environment Variables with the "Sensitive" option enabled</li>
            <li>Secrets are encrypted and masked in build logs</li>
            <li>Secrets can be scoped to specific apps or workflows</li>
            <li>Bitrise also offers Secrets management through the Secrets tab</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Setting Up Secrets in Bitrise</h3>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Log in to your Bitrise account</li>
            <li>Navigate to your app</li>
            <li>Go to Workflow Editor → Secrets tab</li>
            <li>Click "Add new" and enter the key and value for your secret</li>
            <li>Toggle "Expose for Pull Requests" only if needed (usually keep this off for sensitive values)</li>
            <li>Click "Add new secret"</li>
          </ol>
          <p className="mt-2 text-sm">
            Alternatively, you can add secrets as Environment Variables:
          </p>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Go to Workflow Editor → Env Vars tab</li>
            <li>Click "Add new"</li>
            <li>Enter the key and value</li>
            <li>Check "Make sensitive" to secure the value</li>
            <li>Click "Add new env var"</li>
          </ol>
          <p className="mt-2 text-sm">
            For more details, see the <a href="https://devcenter.bitrise.io/en/builds/secrets.html" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Bitrise secrets documentation</a>.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Required Secrets by Context</h2>
        <p className="text-muted-foreground">
          Different workflow configurations require different sets of secrets
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Storage Provider Secrets</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium">Provider</th>
                  <th className="px-4 py-2 text-left font-medium">Required Secrets</th>
                  <th className="px-4 py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">GitHub Artifacts</td>
                  <td className="px-4 py-2 font-mono text-xs">None</td>
                  <td className="px-4 py-2 text-sm">Uses GITHUB_TOKEN automatically</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm" rowSpan={2}>Firebase App Distribution</td>
                  <td className="px-4 py-2 font-mono text-xs">FIREBASE_APP_ID</td>
                  <td className="px-4 py-2 text-sm">Your Firebase App ID</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">FIREBASE_TOKEN</td>
                  <td className="px-4 py-2 text-sm">Firebase CLI authentication token</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm" rowSpan={3}>Google Drive</td>
                  <td className="px-4 py-2 font-mono text-xs">GOOGLE_DRIVE_CLIENT_ID</td>
                  <td className="px-4 py-2 text-sm">OAuth client ID</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">GOOGLE_DRIVE_CLIENT_SECRET</td>
                  <td className="px-4 py-2 text-sm">OAuth client secret</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">GOOGLE_DRIVE_REFRESH_TOKEN</td>
                  <td className="px-4 py-2 text-sm">OAuth refresh token</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm" rowSpan={3}>Amazon S3</td>
                  <td className="px-4 py-2 font-mono text-xs">AWS_ACCESS_KEY_ID</td>
                  <td className="px-4 py-2 text-sm">AWS access key with S3 permissions</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">AWS_SECRET_ACCESS_KEY</td>
                  <td className="px-4 py-2 text-sm">Corresponding AWS secret key</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">AWS_BUCKET_NAME</td>
                  <td className="px-4 py-2 text-sm">Target S3 bucket name</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Platform-Specific Secrets</h3>
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
                  <td className="px-4 py-2 text-sm">Base64-encoded keystore file</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">ANDROID_KEYSTORE_PASSWORD</td>
                  <td className="px-4 py-2 text-sm">Password for the keystore file</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">ANDROID_KEY_ALIAS</td>
                  <td className="px-4 py-2 text-sm">Alias of the key in the keystore</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">ANDROID_KEY_PASSWORD</td>
                  <td className="px-4 py-2 text-sm">Password for the specific key</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm" rowSpan={3}>iOS</td>
                  <td className="px-4 py-2 font-mono text-xs">IOS_DISTRIBUTION_CERT_BASE64</td>
                  <td className="px-4 py-2 text-sm">Base64-encoded distribution certificate</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">IOS_PROVISIONING_PROFILE_BASE64</td>
                  <td className="px-4 py-2 text-sm">Base64-encoded provisioning profile</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">IOS_CERT_PASSWORD</td>
                  <td className="px-4 py-2 text-sm">Certificate password</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Secrets</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium">Notification Type</th>
                  <th className="px-4 py-2 text-left font-medium">Required Secrets</th>
                  <th className="px-4 py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Slack</td>
                  <td className="px-4 py-2 font-mono text-xs">SLACK_WEBHOOK_URL</td>
                  <td className="px-4 py-2 text-sm">Webhook URL for posting to Slack channel</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Teams</td>
                  <td className="px-4 py-2 font-mono text-xs">TEAMS_WEBHOOK_URL</td>
                  <td className="px-4 py-2 text-sm">Webhook URL for posting to Teams channel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}