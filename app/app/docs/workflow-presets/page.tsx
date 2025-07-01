import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Check, AlertCircle, Box, Smartphone } from 'lucide-react';

export default function WorkflowPresetsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Workflow Types
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore the available workflow types and their features
        </p>
      </div>

      <p className="leading-7">
        The React Native CI Workflow Builder offers pre-configured workflow
        templates for common CI/CD scenarios. Choose the workflow type that best
        suits your needs from the options below.
      </p>

      <Tabs defaultValue="static-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="static-analysis">Static Analysis</TabsTrigger>
          <TabsTrigger value="build">Build</TabsTrigger>
        </TabsList>

        <TabsContent value="static-analysis" className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <AlertCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">
                Static Analysis Workflow
              </h2>
              <p className="text-muted-foreground">
                Runs code quality checks to ensure your React Native code meets
                quality standards
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p>
              The Static Analysis workflow helps you maintain code quality by
              running various checks on your codebase. It's designed to catch
              issues early in the development process and is ideal for running
              on pull requests.
            </p>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Included Checks</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <span className="font-medium">
                      TypeScript Type Checking
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Ensures your TypeScript code is type-safe and catches type
                      errors
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <span className="font-medium">ESLint</span>
                    <p className="text-sm text-muted-foreground">
                      Checks your code against linting rules to ensure
                      consistency and catch potential issues
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <span className="font-medium">Prettier</span>
                    <p className="text-sm text-muted-foreground">
                      Verifies code formatting to maintain consistent style
                      across your codebase
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <div>
                    <span className="font-medium">Unit Tests</span>
                    <p className="text-sm text-muted-foreground">
                      Runs your Jest tests to ensure functionality works as
                      expected
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold">
              When to use Static Analysis Workflows
            </h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                For continuous integration on your main development branches
              </li>
              <li>As required checks on pull requests before merging</li>
              <li>For early detection of quality and type issues</li>
              <li>
                When you want to ensure all tests pass before proceeding with
                builds
              </li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuration Options</h3>
            <p>
              In the web app, you can configure the following options for Static
              Analysis workflows:
            </p>

            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left font-medium">Option</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left font-medium">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Workflow Name</td>
                    <td className="px-4 py-2">Custom name for the workflow</td>
                    <td className="px-4 py-2 font-mono text-sm">
                      React Native Static Analysis
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Node.js Versions</td>
                    <td className="px-4 py-2">
                      Which Node.js versions to test against
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">[18]</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Package Manager</td>
                    <td className="px-4 py-2">Which package manager to use</td>
                    <td className="px-4 py-2 font-mono text-sm">yarn</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">TypeScript Check</td>
                    <td className="px-4 py-2">
                      Enable/disable TypeScript type checking
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">enabled</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">ESLint</td>
                    <td className="px-4 py-2">Enable/disable ESLint checks</td>
                    <td className="px-4 py-2 font-mono text-sm">enabled</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Prettier</td>
                    <td className="px-4 py-2">
                      Enable/disable Prettier format checking
                    </td>
                    <td className="px-4 py-2 font-mono text-sm">enabled</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Unit Tests</td>
                    <td className="px-4 py-2">Enable/disable Jest test runs</td>
                    <td className="px-4 py-2 font-mono text-sm">enabled</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-5">
            <h3 className="font-semibold">
              Getting Started with Static Analysis
            </h3>
            <p className="mt-2 text-sm">
              To create a Static Analysis workflow in the web app:
            </p>
            <ol className="ml-6 mt-2 list-decimal space-y-1 text-sm">
              <li>Select "Static Analysis" from the workflow type dropdown</li>
              <li>Configure your triggers (push, pull request, etc.)</li>
              <li>Select which quality checks to enable</li>
              <li>Configure Node.js version and package manager</li>
              <li>Review the generated YAML and download</li>
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="build" className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Box className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Build Workflow</h2>
              <p className="text-muted-foreground">
                Builds your React Native app for Android and/or iOS platforms
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p>
              The Build workflow helps you automate the process of building and
              distributing your React Native application for Android and iOS
              platforms. It handles environment setup, dependency installation,
              and platform-specific build processes.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold">Android Builds</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        Debug or Release builds
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        APK or AAB output formats
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        Signing configuration
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        Multiple artifact storage options
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">iOS Builds</h3>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        Debug or Release builds
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        IPA file generation
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        Provisioning profile management
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                    <div>
                      <span className="text-sm font-medium">
                        Certificate handling
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold">Storage Options</h3>
            <p>Build workflows can store artifacts in different locations:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                <span className="font-medium">GitHub Artifacts</span>: Store
                directly in GitHub Actions
              </li>
              <li>
                <span className="font-medium">Firebase App Distribution</span>:
                Distribute to testers
              </li>
              <li>
                <span className="font-medium">Google Drive</span>: Flexible
                storage and sharing
              </li>
              <li>
                <span className="font-medium">Amazon S3</span>: Scalable cloud
                storage
              </li>
            </ul>

            <h3 className="text-lg font-semibold">
              When to use Build Workflows
            </h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>For generating installable app builds for testing</li>
              <li>For distributing builds to testers and stakeholders</li>
              <li>For preparing release builds for app stores</li>
              <li>For automating the build process in your CI/CD pipeline</li>
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuration Options</h3>
            <p>
              In the web app, you can configure the following options for Build
              workflows:
            </p>

            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left font-medium">Option</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      Available Values
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Platform</td>
                    <td className="px-4 py-2">Which platform to build for</td>
                    <td className="px-4 py-2 text-sm">android, ios, both</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Build Variant</td>
                    <td className="px-4 py-2">Which build variant to create</td>
                    <td className="px-4 py-2 text-sm">debug, release</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">
                      Android Output Type
                    </td>
                    <td className="px-4 py-2">
                      Which output format for Android
                    </td>
                    <td className="px-4 py-2 text-sm">apk, aab, both</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">Storage Provider</td>
                    <td className="px-4 py-2">
                      Where to store build artifacts
                    </td>
                    <td className="px-4 py-2 text-sm">
                      github, firebase, google-drive, s3
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">
                      Notification Method
                    </td>
                    <td className="px-4 py-2">How to notify about builds</td>
                    <td className="px-4 py-2 text-sm">
                      none, pr-comment, slack, teams, email
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium">
                      Include Static Analysis
                    </td>
                    <td className="px-4 py-2">
                      Run static analysis before building
                    </td>
                    <td className="px-4 py-2 text-sm">true, false</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg bg-muted/40 p-5">
            <h3 className="font-semibold">
              Getting Started with Build Workflows
            </h3>
            <p className="mt-2 text-sm">
              To create a Build workflow in the web app:
            </p>
            <ol className="ml-6 mt-2 list-decimal space-y-1 text-sm">
              <li>Select "Build" from the workflow type dropdown</li>
              <li>Choose the platform (Android, iOS, or both)</li>
              <li>Select build variant and output format</li>
              <li>Configure storage and notification options</li>
              <li>Configure environment and signing details</li>
              <li>Review the generated YAML and download</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Creating a Workflow in the Web App
        </h2>
        <ol className="space-y-4">
          <li className="flex gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xs font-medium">1</span>
            </div>
            <div>
              <h3 className="font-medium">Choose your workflow type</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Select either Static Analysis or Build workflow from the
                dropdown menu, depending on your needs.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xs font-medium">2</span>
            </div>
            <div>
              <h3 className="font-medium">Configure basic settings</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Set workflow name, Node.js version, package manager, and trigger
                events.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xs font-medium">3</span>
            </div>
            <div>
              <h3 className="font-medium">
                Configure workflow-specific options
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Set options specific to your chosen workflow type (quality
                checks or build settings).
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xs font-medium">4</span>
            </div>
            <div>
              <h3 className="font-medium">Review the generated YAML</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Check the preview panel to see the workflow YAML generated from
                your configuration.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xs font-medium">5</span>
            </div>
            <div>
              <h3 className="font-medium">
                Download and add to your repository
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Download the workflow file and add it to your repository's{' '}
                <code>.github/workflows</code> directory.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
