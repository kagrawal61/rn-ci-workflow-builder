import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default function StorageOptionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Storage Options
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Configure where and how build artifacts are stored
        </p>
      </div>

      <div>
        <p className="leading-7">
          When building your React Native app using the workflow builder, you
          need to decide where to store your build artifacts (APK, AAB, or IPA
          files). The web app provides multiple storage options to suit
          different needs, from simple testing to complex distribution
          workflows.
        </p>
        <p className="mt-4 leading-7">
          This guide helps you choose the best storage option for your specific
          needs and shows you how to configure each one directly in the web app
          interface.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-2 font-semibold">
            Choosing the Right Storage Option
          </h3>
          <p className="text-sm text-muted-foreground">
            Your choice depends on factors like:
          </p>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
            <li>Who needs access to your builds</li>
            <li>How long you need to store them</li>
            <li>What level of security you require</li>
            <li>Which existing services you already use</li>
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="mb-2 font-semibold">
            How to Configure in the Web App
          </h3>
          <p className="text-sm text-muted-foreground">
            When creating a build workflow in the web app:
          </p>
          <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm">
            <li>Select "Build" as your workflow type</li>
            <li>Fill in the basic configuration options</li>
            <li>Choose your storage provider from the dropdown menu</li>
            <li>The app will display the required secrets automatically</li>
          </ol>
        </Card>
      </div>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Storage Options at a Glance
        </h2>
        <p className="text-muted-foreground">
          Quick comparison of available storage options in the web app
        </p>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="px-4 py-2 text-left font-medium">Provider</th>
                <th className="px-4 py-2 text-left font-medium">
                  Ease of Setup
                </th>
                <th className="px-4 py-2 text-left font-medium">Best For</th>
                <th className="px-4 py-2 text-left font-medium">User Access</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 font-medium">GitHub Artifacts</td>
                <td className="px-4 py-2">★★★★★</td>
                <td className="px-4 py-2">Development teams, quick testing</td>
                <td className="px-4 py-2">GitHub users with repo access</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-medium">
                  Firebase App Distribution
                </td>
                <td className="px-4 py-2">★★★☆☆</td>
                <td className="px-4 py-2">
                  Testing groups, stakeholder previews
                </td>
                <td className="px-4 py-2">Anyone with email invitation</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-medium">Google Drive</td>
                <td className="px-4 py-2">★★☆☆☆</td>
                <td className="px-4 py-2">Team sharing, long-term storage</td>
                <td className="px-4 py-2">Anyone with sharing permissions</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-medium">Amazon S3</td>
                <td className="px-4 py-2">★☆☆☆☆</td>
                <td className="px-4 py-2">Enterprise, custom distribution</td>
                <td className="px-4 py-2">Configurable with IAM policies</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-2 flex justify-end">
          <Link
            href="#multi-storage"
            className="flex items-center text-sm text-primary hover:underline"
          >
            Need multiple storage options?{' '}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          GitHub Actions Artifacts
        </h2>
        <p className="text-muted-foreground">
          Store build artifacts directly in GitHub Actions using the built-in
          artifacts system
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            When to Use GitHub Artifacts
          </h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              You want the simplest setup (no additional accounts required)
            </li>
            <li>Your builds are only needed by developers and GitHub users</li>
            <li>Your artifacts are relatively small (&lt;2GB)</li>
            <li>You need builds stored temporarily (90 days maximum)</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features and Limitations</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium">Feature</th>
                  <th className="px-4 py-2 text-left font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Ease of setup</td>
                  <td className="px-4 py-2 text-sm">
                    ★★★★★ (Built into GitHub Actions)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">External sharing</td>
                  <td className="px-4 py-2 text-sm">
                    ★☆☆☆☆ (Limited to GitHub users with repository access)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Retention period</td>
                  <td className="px-4 py-2 text-sm">
                    90 days (configurable, but with maximum limit)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Size limits</td>
                  <td className="px-4 py-2 text-sm">2GB per artifact</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Access control</td>
                  <td className="px-4 py-2 text-sm">
                    Based on repository permissions
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Cost</td>
                  <td className="px-4 py-2 text-sm">
                    Free (included with GitHub Actions)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Setting Up GitHub Artifacts in the Web App
          </h3>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">Step-by-Step Configuration</h4>
            <ol className="ml-4 mt-2 list-decimal space-y-2 text-sm">
              <li>
                <span className="font-medium">Select your workflow type</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "Build" from the workflow type dropdown in the web app
                </p>
              </li>
              <li>
                <span className="font-medium">Configure platform settings</span>
                <p className="mt-1 text-muted-foreground">
                  Select Android, iOS, or both platforms and your build variant
                </p>
              </li>
              <li>
                <span className="font-medium">Select storage provider</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "GitHub Artifacts" from the storage dropdown menu
                </p>
              </li>
              <li>
                <span className="font-medium">
                  No additional secrets needed
                </span>
                <p className="mt-1 text-muted-foreground">
                  GitHub Artifacts uses the built-in GITHUB_TOKEN automatically
                </p>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">How to Access Your Builds</h4>
            <p className="mt-2 text-sm">After the workflow completes:</p>
            <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm">
              <li>Go to your GitHub repository</li>
              <li>Click on the "Actions" tab</li>
              <li>Select the workflow run that built your app</li>
              <li>In the run summary, find the "Artifacts" section</li>
              <li>Download the ZIP file containing your build files</li>
            </ol>
          </div>
        </div>

        <div className="rounded-lg bg-muted/40 p-4">
          <h4 className="font-semibold">How it works behind the scenes</h4>
          <p className="mt-2 text-sm">
            When using GitHub storage, the workflow will:
          </p>
          <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm">
            <li>Build the application for the specified platform</li>
            <li>Collect the build artifacts (APK, AAB, IPA files)</li>
            <li>
              Upload them using the <code>actions/upload-artifact@v4</code>{' '}
              action
            </li>
            <li>Make them available for download from the workflow run page</li>
          </ol>
          <p className="mt-2 text-sm font-medium">
            Artifacts are automatically named with your app name and build type
            for easy identification.
          </p>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Firebase App Distribution
        </h2>
        <p className="text-muted-foreground">
          Distribute builds to testers and stakeholders with Firebase's
          specialized mobile app distribution platform
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            When to Use Firebase App Distribution
          </h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>You need to distribute builds to external testers</li>
            <li>You want email notifications for new builds</li>
            <li>You need to organize testers into groups</li>
            <li>You want in-app feedback collection</li>
            <li>You need app crash reporting integration</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features and Limitations</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium">Feature</th>
                  <th className="px-4 py-2 text-left font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Ease of setup</td>
                  <td className="px-4 py-2 text-sm">
                    ★★★☆☆ (Requires Firebase project setup)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">External sharing</td>
                  <td className="px-4 py-2 text-sm">
                    ★★★★★ (Email invitations to any tester)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Retention period</td>
                  <td className="px-4 py-2 text-sm">Unlimited</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Size limits</td>
                  <td className="px-4 py-2 text-sm">1GB per app</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Tester management</td>
                  <td className="px-4 py-2 text-sm">
                    Excellent (groups, permissions, email invites)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Feedback collection</td>
                  <td className="px-4 py-2 text-sm">Yes (in-app feedback)</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Cost</td>
                  <td className="px-4 py-2 text-sm">Free tier available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Setup Requirements</h3>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Create a Firebase project</li>
            <li>Register your Android/iOS app in Firebase</li>
            <li>Get your Firebase App ID</li>
            <li>
              Generate a Firebase CLI token with: <code>firebase login:ci</code>
            </li>
          </ol>

          <div className="mt-2 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Required secrets:</p>
            <ul className="ml-5 mt-1 list-disc text-sm">
              <li>
                <code>FIREBASE_APP_ID</code>: Your Firebase App ID
              </li>
              <li>
                <code>FIREBASE_TOKEN</code>: Firebase CLI authentication token
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Setting Up Firebase Distribution in the Web App
          </h3>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">Step-by-Step Configuration</h4>
            <ol className="ml-4 mt-2 list-decimal space-y-2 text-sm">
              <li>
                <span className="font-medium">Select your workflow type</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "Build" from the workflow type dropdown
                </p>
              </li>
              <li>
                <span className="font-medium">Configure platform settings</span>
                <p className="mt-1 text-muted-foreground">
                  Select Android, iOS, or both platforms and your build variant
                </p>
              </li>
              <li>
                <span className="font-medium">Select storage provider</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "Firebase App Distribution" from the storage dropdown
                </p>
              </li>
              <li>
                <span className="font-medium">Configure Firebase options</span>
                <p className="mt-1 text-muted-foreground">
                  Add tester groups (comma-separated) and release notes
                </p>
              </li>
              <li>
                <span className="font-medium">Add required secrets</span>
                <p className="mt-1 text-muted-foreground">
                  Note the required secrets (FIREBASE_APP_ID, FIREBASE_TOKEN) to
                  add to GitHub
                </p>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">How to Access Your Builds</h4>
            <p className="mt-2 text-sm">After the workflow completes:</p>
            <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm">
              <li>
                Testers will receive email notifications with download links
              </li>
              <li>
                Testers can access builds through the Firebase App Tester app on
                their devices
              </li>
              <li>
                Project admins can view all distributions in the Firebase
                console
              </li>
              <li>
                Build status will be visible in both GitHub Actions and Firebase
                console
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted/40 p-4">
            <h4 className="font-semibold">
              Pro Tips for Firebase Distribution
            </h4>
            <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
              <li>
                Use descriptive release notes to help testers understand what to
                test
              </li>
              <li>
                Organize testers into logical groups (e.g., "qa",
                "product-team", "beta-users")
              </li>
              <li>Enable in-app feedback collection in Firebase console</li>
              <li>
                Use build version variables in release notes to automatically
                include version numbers
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Google Drive</h2>
        <p className="text-muted-foreground">
          Store build artifacts in Google Drive with flexible sharing options
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">When to Use Google Drive</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>You need long-term storage of build artifacts</li>
            <li>You want to organize builds in folder hierarchies</li>
            <li>You need to share builds with specific people via email</li>
            <li>You want control over access permissions</li>
            <li>You need to store supplementary files alongside builds</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features and Limitations</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium">Feature</th>
                  <th className="px-4 py-2 text-left font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Ease of setup</td>
                  <td className="px-4 py-2 text-sm">
                    ★★☆☆☆ (Requires OAuth configuration)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">External sharing</td>
                  <td className="px-4 py-2 text-sm">
                    ★★★★☆ (Flexible sharing options)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Retention period</td>
                  <td className="px-4 py-2 text-sm">
                    Unlimited (within storage quota)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Size limits</td>
                  <td className="px-4 py-2 text-sm">
                    15GB free per Google account
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Organization options</td>
                  <td className="px-4 py-2 text-sm">
                    Folders, metadata, searchable
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Cost</td>
                  <td className="px-4 py-2 text-sm">
                    15GB free, paid plans available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Setup Requirements</h3>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Create a Google Cloud Platform project</li>
            <li>Enable the Google Drive API</li>
            <li>Create OAuth credentials (client ID and secret)</li>
            <li>Generate a refresh token with appropriate scopes</li>
          </ol>

          <div className="mt-2 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Required secrets:</p>
            <ul className="ml-5 mt-1 list-disc text-sm">
              <li>
                <code>GOOGLE_DRIVE_CLIENT_ID</code>: OAuth client ID
              </li>
              <li>
                <code>GOOGLE_DRIVE_CLIENT_SECRET</code>: OAuth client secret
              </li>
              <li>
                <code>GOOGLE_DRIVE_REFRESH_TOKEN</code>: OAuth refresh token
              </li>
              <li>
                <code>GOOGLE_DRIVE_FOLDER_ID</code>: (optional) Parent folder ID
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Setting Up Google Drive in the Web App
          </h3>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">Step-by-Step Configuration</h4>
            <ol className="ml-4 mt-2 list-decimal space-y-2 text-sm">
              <li>
                <span className="font-medium">Select your workflow type</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "Build" from the workflow type dropdown
                </p>
              </li>
              <li>
                <span className="font-medium">Configure platform settings</span>
                <p className="mt-1 text-muted-foreground">
                  Select Android, iOS, or both platforms and your build variant
                </p>
              </li>
              <li>
                <span className="font-medium">Select storage provider</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "Google Drive" from the storage dropdown
                </p>
              </li>
              <li>
                <span className="font-medium">
                  Configure Google Drive options
                </span>
                <p className="mt-1 text-muted-foreground">
                  Set folder path and sharing email addresses
                </p>
              </li>
              <li>
                <span className="font-medium">Add required secrets</span>
                <p className="mt-1 text-muted-foreground">
                  Note the required OAuth credentials to add to GitHub
                </p>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">How to Access Your Builds</h4>
            <p className="mt-2 text-sm">After the workflow completes:</p>
            <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm">
              <li>
                Log in to Google Drive with the account that owns the
                credentials
              </li>
              <li>
                Navigate to the folder path you specified in the configuration
              </li>
              <li>
                Files will be named with app name, version, build type, and
                timestamp
              </li>
              <li>
                People listed in the "shareWith" option will receive email
                notifications
              </li>
              <li>
                You can manually adjust sharing permissions in Google Drive if
                needed
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted/40 p-4">
            <h4 className="font-semibold">Pro Tips for Google Drive</h4>
            <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
              <li>
                Use a dedicated service account for CI/CD workflows instead of
                personal account
              </li>
              <li>
                Create a consistent folder structure with date-based subfolders
              </li>
              <li>
                Use Google Drive File Stream for quick access to builds on your
                desktop
              </li>
              <li>
                Consider setting up automatic cleanup of old builds using Google
                Apps Script
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Amazon S3</h2>
        <p className="text-muted-foreground">
          Store build artifacts in Amazon S3 with scalable, secure cloud storage
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">When to Use Amazon S3</h3>
          <ul className="ml-6 list-disc space-y-2">
            <li>You need secure, scalable storage</li>
            <li>You have existing AWS infrastructure</li>
            <li>You want fine-grained access control policies</li>
            <li>You need to integrate with other AWS services</li>
            <li>You want to host a download portal or distribution site</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features and Limitations</h3>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-2 text-left font-medium">Feature</th>
                  <th className="px-4 py-2 text-left font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Ease of setup</td>
                  <td className="px-4 py-2 text-sm">
                    ★☆☆☆☆ (Requires AWS account and IAM setup)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">External sharing</td>
                  <td className="px-4 py-2 text-sm">
                    ★★★☆☆ (Pre-signed URLs or public access)
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Retention period</td>
                  <td className="px-4 py-2 text-sm">
                    Configurable with lifecycle policies
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Size limits</td>
                  <td className="px-4 py-2 text-sm">Unlimited</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Security features</td>
                  <td className="px-4 py-2 text-sm">
                    Advanced IAM policies, encryption, versioning
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2 text-sm">Cost</td>
                  <td className="px-4 py-2 text-sm">Pay as you go</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Setup Requirements</h3>
          <ol className="ml-6 list-decimal space-y-2">
            <li>Create an AWS account</li>
            <li>Create an S3 bucket</li>
            <li>Configure bucket policies</li>
            <li>Create IAM user with S3 permissions</li>
            <li>Generate access key and secret key</li>
          </ol>

          <div className="mt-2 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Required secrets:</p>
            <ul className="ml-5 mt-1 list-disc text-sm">
              <li>
                <code>AWS_ACCESS_KEY_ID</code>: AWS access key with S3
                permissions
              </li>
              <li>
                <code>AWS_SECRET_ACCESS_KEY</code>: Corresponding secret key
              </li>
              <li>
                <code>AWS_BUCKET_NAME</code>: Target S3 bucket name
              </li>
              <li>
                <code>AWS_REGION</code>: (optional) AWS region
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Setting Up Amazon S3 in the Web App
          </h3>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">Step-by-Step Configuration</h4>
            <ol className="ml-4 mt-2 list-decimal space-y-2 text-sm">
              <li>
                <span className="font-medium">Select your workflow type</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "Build" from the workflow type dropdown
                </p>
              </li>
              <li>
                <span className="font-medium">Configure platform settings</span>
                <p className="mt-1 text-muted-foreground">
                  Select Android, iOS, or both platforms and your build variant
                </p>
              </li>
              <li>
                <span className="font-medium">Select storage provider</span>
                <p className="mt-1 text-muted-foreground">
                  Choose "Amazon S3" from the storage dropdown
                </p>
              </li>
              <li>
                <span className="font-medium">Configure S3 options</span>
                <p className="mt-1 text-muted-foreground">
                  Set S3 key prefix (folder path) and access settings
                </p>
              </li>
              <li>
                <span className="font-medium">Add required secrets</span>
                <p className="mt-1 text-muted-foreground">
                  Note the required AWS credentials to add to GitHub
                </p>
              </li>
            </ol>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="font-medium">How to Access Your Builds</h4>
            <p className="mt-2 text-sm">After the workflow completes:</p>
            <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm">
              <li>Log in to your AWS Management Console</li>
              <li>
                Navigate to the S3 bucket you specified in your configuration
              </li>
              <li>
                Browse to the key prefix (folder path) where your builds are
                stored
              </li>
              <li>
                Download directly or generate pre-signed URLs for temporary
                access
              </li>
              <li>
                For public buckets, direct download links will work without
                authentication
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted/40 p-4">
            <h4 className="font-semibold">Pro Tips for Amazon S3</h4>
            <ul className="ml-4 mt-2 list-disc space-y-1 text-sm">
              <li>
                Create a dedicated IAM user with minimal permissions for CI/CD
                uploads
              </li>
              <li>
                Set up lifecycle rules to automatically delete old builds after
                a certain period
              </li>
              <li>
                Use CloudFront to create a distribution network for faster
                downloads globally
              </li>
              <li>
                Consider enabling versioning on your bucket for build history
              </li>
              <li>
                Implement proper bucket policies to control access precisely
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4" id="multi-storage">
        <h2 className="text-2xl font-semibold tracking-tight">
          Using Multiple Storage Providers
        </h2>
        <p className="text-muted-foreground">
          Store build artifacts in multiple locations simultaneously for
          different purposes
        </p>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium">Why Use Multiple Storage Options?</h4>
            <ul className="ml-4 mt-2 list-disc space-y-2 text-sm">
              <li>
                <span className="font-medium">Different Audience Needs</span>
                <p className="mt-1 text-muted-foreground">
                  Developers might prefer GitHub Artifacts while QA testers need
                  Firebase App Distribution
                </p>
              </li>
              <li>
                <span className="font-medium">Backup and Redundancy</span>
                <p className="mt-1 text-muted-foreground">
                  Store critical builds in multiple locations for safety
                </p>
              </li>
              <li>
                <span className="font-medium">
                  Short-term and Long-term Storage
                </span>
                <p className="mt-1 text-muted-foreground">
                  Use GitHub for temporary access and S3/Drive for long-term
                  archiving
                </p>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Setting Up Multiple Storage in the Web App
            </h3>
            <ol className="ml-6 list-decimal space-y-2 text-sm">
              <li>Select "Build" as your workflow type</li>
              <li>Configure your platform settings as usual</li>
              <li>
                In the storage provider dropdown, select "Multiple Storage
                Options"
              </li>
              <li>Check the boxes for all storage providers you want to use</li>
              <li>Configure the options for each selected provider</li>
              <li>
                The web app will show all required secrets across all selected
                providers
              </li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted/40 p-4">
            <h4 className="font-semibold">How Multiple Storage Works</h4>
            <p className="mt-2 text-sm">
              When you configure multiple storage options, the workflow builder
              will:
            </p>
            <ol className="ml-4 mt-2 list-decimal space-y-1 text-sm">
              <li>Build your application once</li>
              <li>
                Upload the same build artifacts to each selected storage
                provider
              </li>
              <li>
                Apply provider-specific options to each upload (e.g., tester
                groups for Firebase)
              </li>
              <li>
                Report success/failure for each storage provider separately
              </li>
              <li>
                Provide links to each storage location in the workflow summary
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Making the Right Choice for Your Team
        </h2>
        <p className="text-muted-foreground">
          Recommendations to help you choose the optimal storage solution
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-5">
            <h3 className="mb-3 font-semibold">Recommended for Small Teams</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              For teams with fewer than 10 developers and simple distribution
              needs:
            </p>
            <ul className="ml-4 list-disc space-y-2 text-sm">
              <li>
                <span className="font-medium">Primary: GitHub Artifacts</span>
                <p className="mt-1 text-muted-foreground">
                  Simple setup with no additional accounts required
                </p>
              </li>
              <li>
                <span className="font-medium">
                  Optional Secondary: Firebase
                </span>
                <p className="mt-1 text-muted-foreground">
                  For sharing builds with non-technical stakeholders
                </p>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border p-5">
            <h3 className="mb-3 font-semibold">
              Recommended for Enterprise Teams
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              For larger organizations with complex distribution requirements:
            </p>
            <ul className="ml-4 list-disc space-y-2 text-sm">
              <li>
                <span className="font-medium">
                  Primary: Amazon S3 with CloudFront
                </span>
                <p className="mt-1 text-muted-foreground">
                  Scalable, secure, with fine-grained access control
                </p>
              </li>
              <li>
                <span className="font-medium">
                  Secondary: Firebase App Distribution
                </span>
                <p className="mt-1 text-muted-foreground">
                  For organized test groups and feedback collection
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-muted p-6">
          <h3 className="font-semibold">Storage Best Practices</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-medium">GitHub Artifacts</h4>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Use for developer and CI builds</li>
                <li>Enable workflow artifact retention settings</li>
                <li>
                  Consider size limitations when building multiple architectures
                </li>
                <li>Use for short-term storage and quick team access</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Firebase App Distribution</h4>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Organize testers into logical groups</li>
                <li>Provide detailed release notes</li>
                <li>Configure tester permissions appropriately</li>
                <li>Enable in-app feedback for better tester engagement</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Google Drive</h4>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Create a dedicated service account</li>
                <li>Use a consistent folder structure</li>
                <li>Set up appropriate sharing permissions</li>
                <li>Implement auto-cleanup of older builds</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Amazon S3</h4>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Configure lifecycle policies for old builds</li>
                <li>Use bucket policies for access control</li>
                <li>
                  Consider setting up CloudFront for download distribution
                </li>
                <li>Use versioning for build history tracking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/20 p-6">
          <h3 className="font-semibold">
            Need Help with Your Storage Strategy?
          </h3>
          <p className="mt-2 text-muted-foreground">
            Explore the options in the web app interface for detailed guidance
            on configuring each storage option.
          </p>
        </div>
      </section>
    </div>
  );
}
