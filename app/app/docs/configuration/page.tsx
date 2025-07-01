import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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
          This section serves as a reference for the configuration options available in the web interface. Unlike the 
          step-by-step guide in Getting Started, this page provides a comprehensive overview of all available settings 
          and their impact on your generated workflows.
        </p>
        <p className="mt-4 leading-7">
          Each section below corresponds to a specific area in the web app configuration form, making it easy to 
          find the options you need when building your workflow.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="p-5">
          <h3 className="font-semibold mb-2">Configuring in the Web App</h3>
          <p className="text-sm text-muted-foreground">
            The web app provides an intuitive form interface for all options, with:
          </p>
          <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
            <li>Tooltips explaining each option</li>
            <li>Live YAML preview as you make changes</li>
            <li>Automatic detection of required secrets</li>
            <li>Validation to prevent configuration errors</li>
          </ul>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-2">Common Configuration Tasks</h3>
          <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
            <li><Link href="#trigger-options" className="text-primary hover:underline">Setting up workflow triggers</Link></li>
            <li><Link href="#build-options" className="text-primary hover:underline">Configuring build options</Link></li>
            <li><Link href="#workflow-options" className="text-primary hover:underline">Managing environment variables</Link></li>
            <li><Link href="#workflow-options" className="text-primary hover:underline">Adding necessary secrets</Link></li>
          </ul>
        </Card>
      </div>
      
      <Tabs defaultValue="basic" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Options</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          <TabsTrigger value="reference">Full Reference</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-6">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Essential settings you'll need for most workflows
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Workflow Type</h4>
                <p className="mt-1 text-sm text-muted-foreground">Choose between Static Analysis and Build workflows</p>
                <p className="mt-2 text-sm">Location: First dropdown in the web app</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Workflow Name</h4>
                <p className="mt-1 text-sm text-muted-foreground">Custom name for your workflow</p>
                <p className="mt-2 text-sm">Default: "React Native Static Analysis" or "React Native Build"</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Trigger Events</h4>
                <p className="mt-1 text-sm text-muted-foreground">When the workflow should run (push, pull request, etc.)</p>
                <p className="mt-2 text-sm">Location: Triggers section in the form</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Target Branches</h4>
                <p className="mt-1 text-sm text-muted-foreground">Which branches should trigger the workflow</p>
                <p className="mt-2 text-sm">Default: main branch</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Additional options for more complex workflow requirements
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Environment Variables</h4>
                <p className="mt-1 text-sm text-muted-foreground">Custom environment variables for your workflow</p>
                <p className="mt-2 text-sm">Location: Environment section in the web app</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Storage Configuration</h4>
                <p className="mt-1 text-sm text-muted-foreground">Where to store build artifacts</p>
                <p className="mt-2 text-sm">See: <Link href="/docs/storage-options" className="text-primary hover:underline">Storage Options</Link></p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Path Triggers</h4>
                <p className="mt-1 text-sm text-muted-foreground">Only run workflow when specific files change</p>
                <p className="mt-2 text-sm">Location: Advanced triggers section</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium">Build Matrix</h4>
                <p className="mt-1 text-sm text-muted-foreground">Test against multiple Node.js versions</p>
                <p className="mt-2 text-sm">Location: Node.js versions field</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reference" className="mt-6">
          <div className="space-y-2 text-muted-foreground">
            <p>The complete reference documentation is available below:</p>
          </div>
        </TabsContent>
      </Tabs>


      <section className="space-y-6" id="workflow-options">
        <h2 className="text-2xl font-semibold tracking-tight">Basic Workflow Options</h2>
        <p className="text-muted-foreground">
          Common configuration options available for all workflow types in the web app
        </p>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">How to Configure in the Web App</h3>
          <div className="rounded-lg border p-5">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Workflow Type Selection</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start by selecting either "Static Analysis" or "Build" from the dropdown menu at the top of the form.
                    This determines which workflow template will be used.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Basic Configuration</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter a custom workflow name or use the default. Then configure Node.js version(s) and package manager.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Configure Triggers</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    In the "Triggers" section, select when the workflow should run (on push, pull request, etc.)
                    and specify which branches should activate it.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Workflow-Specific Options</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Depending on your workflow type, configure additional options like build platform or code quality checks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General Options</h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left font-medium">Option</th>
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                    <th className="px-4 py-2 text-left font-medium">Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium text-sm">Workflow Name</td>
                    <td className="px-4 py-2 text-sm">Custom name for your workflow</td>
                    <td className="px-4 py-2 text-sm font-mono">React Native [Type]</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium text-sm">Node.js Version(s)</td>
                    <td className="px-4 py-2 text-sm">Which Node.js version(s) to use</td>
                    <td className="px-4 py-2 text-sm font-mono">18</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium text-sm">Package Manager</td>
                    <td className="px-4 py-2 text-sm">Which package manager to use</td>
                    <td className="px-4 py-2 text-sm font-mono">yarn</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium text-sm">Runner</td>
                    <td className="px-4 py-2 text-sm">GitHub Actions runner to use</td>
                    <td className="px-4 py-2 text-sm font-mono">ubuntu-latest</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="rounded-lg bg-muted/40 p-4">
              <h4 className="font-semibold mb-2">Package Manager Tips</h4>
              <ul className="ml-4 list-disc text-sm space-y-1">
                <li>Select the same package manager you use for local development</li>
                <li>The workflow will automatically detect and use lockfiles</li>
                <li>For Yarn, the workflow will use Yarn Berry if available</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Environment & Secrets</h3>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="px-4 py-2 text-left font-medium">Option</th>
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium text-sm">Environment Variables</td>
                    <td className="px-4 py-2 text-sm">Add custom env vars as key-value pairs</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium text-sm">Secrets</td>
                    <td className="px-4 py-2 text-sm">Add secret references required by your workflow</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2 font-medium text-sm">Cache Configuration</td>
                    <td className="px-4 py-2 text-sm">Control caching for faster workflow runs</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-semibold mb-2">Working with Secrets</h4>
              <p className="text-sm text-muted-foreground">
                The web app will automatically detect required secrets based on your configuration
                (e.g., for signing Android builds or using Firebase). For details, see:
              </p>
              <p className="mt-3">
                <Link href="/docs/secrets-management" className="text-sm text-primary hover:underline inline-flex items-center">
                  Secrets Management Guide
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border p-5 bg-muted/30 mt-8">
          <h3 className="font-semibold mb-2">Configuration Options Overview</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The web app provides a comprehensive set of options for customizing your workflow. These options are organized into logical sections in the interface for easy navigation and configuration.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-3">
              <h4 className="font-medium text-sm">Basic Settings</h4>
              <ul className="mt-1 ml-4 list-disc text-sm space-y-1">
                <li>Workflow name</li>
                <li>Node.js version</li>
                <li>Package manager selection</li>
                <li>Runner environment</li>
              </ul>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-medium text-sm">Triggers & Events</h4>
              <ul className="mt-1 ml-4 list-disc text-sm space-y-1">
                <li>Push events</li>
                <li>Pull request events</li>
                <li>Branch filtering</li>
                <li>Path filtering</li>
              </ul>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-medium text-sm">Environment & Secrets</h4>
              <ul className="mt-1 ml-4 list-disc text-sm space-y-1">
                <li>Environment variables</li>
                <li>Repository secrets</li>
                <li>Dependency caching</li>
              </ul>
            </div>
            <div className="rounded-lg border p-3">
              <h4 className="font-medium text-sm">Workflow-Specific Options</h4>
              <ul className="mt-1 ml-4 list-disc text-sm space-y-1">
                <li>Build platform selection</li>
                <li>Build variants</li>
                <li>Storage providers</li>
                <li>Notification methods</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6" id="workflow-sections">
        <h2 className="text-2xl font-semibold tracking-tight">Workflow Configuration Sections</h2>
        <p className="text-muted-foreground">
          Understanding the main configuration areas in the web app interface
        </p>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">How to Configure Triggers in the Web App</h3>
          <div className="rounded-lg border p-5">
            <p className="mb-4 text-sm">In the "Triggers" section of the form, you can configure:</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-medium">Trigger Events</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select which GitHub events trigger your workflow:
                </p>
                <ul className="mt-2 ml-4 list-disc text-sm space-y-1">
                  <li><span className="font-mono text-xs">push</span>: Run on commits to specified branches</li>
                  <li><span className="font-mono text-xs">pull_request</span>: Run when PRs are opened or updated</li>
                  <li><span className="font-mono text-xs">workflow_dispatch</span>: Allow manual runs from GitHub UI</li>
                  <li><span className="font-mono text-xs">schedule</span>: Run on a time-based schedule</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Branch Filtering</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Control which branches trigger the workflow:
                </p>
                <div className="mt-2 rounded-lg bg-muted/30 p-3">
                  <p className="text-sm">Example patterns:</p>
                  <ul className="mt-1 ml-4 list-disc text-xs space-y-1">
                    <li><span className="font-mono">main</span>: Only the main branch</li>
                    <li><span className="font-mono">develop</span>: Only the develop branch</li>
                    <li><span className="font-mono">release/*</span>: Any branch starting with "release/"</li>
                    <li><span className="font-mono">feature/**</span>: All branches in the feature directory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Common Trigger Configurations</h3>
            <div className="space-y-3">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-1">PR Validation</h4>
                <p className="text-sm text-muted-foreground mb-3">Run workflow on all pull requests to main branch</p>
                <pre className="overflow-x-auto bg-muted/30 p-2 text-xs rounded-md">
                  <code>
{`"triggers": {
  "events": ["pull_request"],
  "branches": ["main"]
}`}
                  </code>
                </pre>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-1">Continuous Integration</h4>
                <p className="text-sm text-muted-foreground mb-3">Run on commits to main and develop branches</p>
                <pre className="overflow-x-auto bg-muted/30 p-2 text-xs rounded-md">
                  <code>
{`"triggers": {
  "events": ["push"],
  "branches": ["main", "develop"]
}`}
                  </code>
                </pre>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-1">Release Build</h4>
                <p className="text-sm text-muted-foreground mb-3">Run on tags matching release pattern</p>
                <pre className="overflow-x-auto bg-muted/30 p-2 text-xs rounded-md">
                  <code>
{`"triggers": {
  "events": ["push"],
  "tags": ["v*.*.*"]
}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Trigger Features</h3>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Path Triggers</h4>
                <p className="text-sm text-muted-foreground">
                  Run workflow only when specific files change. This helps optimize CI/CD resources by only running relevant workflows.
                </p>
                <div className="mt-3">
                  <h5 className="text-sm font-medium">Example: Android-only changes</h5>
                  <pre className="mt-1 overflow-x-auto bg-muted/30 p-2 text-xs rounded-md">
                    <code>
{`"triggers": {
  "events": ["push", "pull_request"],
  "branches": ["main"],
  "paths": ["android/**", "src/**"]
}`}
                    </code>
                  </pre>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Scheduled Builds</h4>
                <p className="text-sm text-muted-foreground">
                  Run workflows on a schedule using cron syntax. Useful for nightly builds or periodic checks.
                </p>
                <div className="mt-3">
                  <h5 className="text-sm font-medium">Example: Nightly build at 2 AM UTC</h5>
                  <pre className="mt-1 overflow-x-auto bg-muted/30 p-2 text-xs rounded-md">
                    <code>
{`"triggers": {
  "events": ["schedule"],
  "cron": "0 2 * * *"
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      <section className="space-y-6" id="build-options">
        <h2 className="text-2xl font-semibold tracking-tight" id="build">Build Configuration</h2>
        <p className="text-muted-foreground">
          Options for configuring React Native build workflows
        </p>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Platform Configuration</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                </div>
                <h4 className="font-semibold">Android Build Options</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Build Variant</p>
                  <div className="flex space-x-2 mt-1">
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">debug</div>
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">release</div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Output Format</p>
                  <div className="flex space-x-2 mt-1">
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">APK</div>
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">AAB</div>
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">Both</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Release builds require signing configuration with keystore credentials.
                  <Link href="/docs/secrets-management#android" className="text-primary hover:underline inline-flex ml-1">
                    View setup guide
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                </div>
                <h4 className="font-semibold">iOS Build Options</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Build Variant</p>
                  <div className="flex space-x-2 mt-1">
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">debug</div>
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">release</div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Output Format</p>
                  <div className="flex space-x-2 mt-1">
                    <div className="text-xs rounded-full px-2 py-1 bg-muted">IPA</div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  iOS builds require certificate and provisioning profile configuration.
                  <Link href="/docs/secrets-management#ios" className="text-primary hover:underline inline-flex ml-1">
                    View setup guide
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Distribution Configuration</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-3">Storage Options</h4>
              
              <div className="space-y-2">
                <p className="text-sm">Choose where to store build artifacts:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">GitHub Artifacts</div>
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">Firebase App Distribution</div>
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">Google Drive</div>
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">Amazon S3</div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Each storage option has different configuration requirements.
                  <Link href="/docs/storage-options" className="text-primary hover:underline inline-flex ml-1">
                    Storage option details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-3">Notification Methods</h4>
              
              <div className="space-y-2">
                <p className="text-sm">Choose how to notify about completed builds:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">PR Comment</div>
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">Slack</div>
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">Microsoft Teams</div>
                  <div className="text-xs rounded-full px-2 py-1 bg-muted">Email</div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  Some notification methods require webhook URLs configured as secrets.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Additional Options</h3>
          
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-start gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="font-medium">Include Static Analysis</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Run code quality checks (TypeScript, ESLint, tests) before building. This ensures you don't build
                  on broken code. Toggle this option on or off in the web app interface.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="font-medium">Custom Build Commands</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add custom pre-build and post-build commands to run before or after the main build process.
                  This is useful for additional setup or processing of build artifacts.
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight" id="static-analysis-options">Static Analysis Configuration</h2>
        <p className="text-muted-foreground">
          Options for configuring code quality checks for your React Native project
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border p-5">
            <h3 className="font-semibold mb-3">Available Quality Checks</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium">TypeScript</h4>
                  <p className="text-sm text-muted-foreground">Type checking to catch type errors</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium">ESLint</h4>
                  <p className="text-sm text-muted-foreground">Linting for code quality</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium">Prettier</h4>
                  <p className="text-sm text-muted-foreground">Code formatting validation</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-medium">Jest Tests</h4>
                  <p className="text-sm text-muted-foreground">Unit and integration tests</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border p-5">
            <h3 className="font-semibold mb-3">How to Configure in the Web App</h3>
            <ol className="ml-6 list-decimal text-sm space-y-2">
              <li>
                <span className="font-medium">Select Static Analysis workflow type</span>
                <p className="mt-1 text-muted-foreground">Choose "Static Analysis" from the dropdown menu</p>
              </li>
              <li>
                <span className="font-medium">Configure basic options</span>
                <p className="mt-1 text-muted-foreground">Set workflow name, Node.js version, etc.</p>
              </li>
              <li>
                <span className="font-medium">Enable/disable specific checks</span>
                <p className="mt-1 text-muted-foreground">Toggle TypeScript, ESLint, Prettier, and Tests</p>
              </li>
              <li>
                <span className="font-medium">Configure test settings</span>
                <p className="mt-1 text-muted-foreground">Set test coverage thresholds if needed</p>
              </li>
            </ol>
          </div>
        </div>
        
        <div className="rounded-lg bg-muted/40 p-5">
          <h3 className="font-semibold mb-2">Static Analysis Best Practices</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium mb-1">For Pull Requests</h4>
              <ul className="ml-4 list-disc text-sm space-y-1">
                <li>Enable all checks to ensure code quality</li>
                <li>Set as required status checks in GitHub</li>
                <li>Keep test threshold requirements reasonable</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">For Performance</h4>
              <ul className="ml-4 list-disc text-sm space-y-1">
                <li>Enable dependency caching for faster runs</li>
                <li>Use path filters to only run on relevant changes</li>
                <li>Consider separating slow tests into separate workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-lg bg-muted p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Web App Preview and Validation</h3>
            <p className="mt-2 text-sm">
              The web app provides real-time YAML preview as you configure your workflows. It also validates your 
              configuration and highlights potential issues before generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}