import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconCheck } from "@tabler/icons-react";

export default function ExamplesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Examples & Recipes</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ready-to-use workflow configurations and recipes for common scenarios
        </p>
      </div>

      <div className="leading-7">
        <p>
          Browse these examples to quickly set up workflows for your React Native project.
          Each example can be customized to fit your specific requirements.
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Workflows</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Workflows</TabsTrigger>
          <TabsTrigger value="custom">Custom Recipes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Health Check Workflow */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">Basic Health Check Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Run TypeScript, ESLint, Prettier, and Jest tests on each PR
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "health-check",
  "options": {
    "name": "React Native Health Check",
    "triggers": {
      "branches": ["main", "develop"],
      "events": ["pull_request"]
    },
    "nodeVersions": [18],
    "packageManager": "yarn"
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Best for validating PRs</span>
              </div>
            </Card>

            {/* Android Build Workflow */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">Android Build Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Build Android APK on each push to main branch
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "build",
  "options": {
    "name": "Android Build",
    "triggers": {
      "branches": ["main"],
      "events": ["push"]
    },
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
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Stores APK as workflow artifact</span>
              </div>
            </Card>
            
            {/* iOS Build Workflow */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">iOS Build Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Build iOS app on each push to main branch
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "build",
  "options": {
    "name": "iOS Build",
    "triggers": {
      "branches": ["main"],
      "events": ["push"]
    },
    "build": {
      "platform": "ios",
      "variant": "release",
      "storage": "github"
    }
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Requires iOS secrets configuration</span>
              </div>
            </Card>

            {/* PR Check with Build Preview */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">PR Check with Build Preview</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Run health checks and build Android debug APK for PRs
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "build",
  "options": {
    "name": "PR Check & Preview",
    "triggers": {
      "events": ["pull_request"]
    },
    "build": {
      "platform": "android",
      "variant": "debug",
      "storage": "github",
      "notification": "pr-comment",
      "includeHealthCheck": true
    }
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Comments build link on PR</span>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Multi-Platform Build */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">Multi-Platform Build Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Build both Android and iOS apps with health checks
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "build",
  "options": {
    "name": "Multi-Platform Build",
    "triggers": {
      "branches": ["main", "release/*"],
      "events": ["push"]
    },
    "build": {
      "platform": "both",
      "variant": "release",
      "storage": "github",
      "includeHealthCheck": true
    },
    "secrets": [
      "ANDROID_KEYSTORE_BASE64",
      "ANDROID_KEYSTORE_PASSWORD",
      "ANDROID_KEY_ALIAS",
      "ANDROID_KEY_PASSWORD",
      "IOS_DISTRIBUTION_CERT_BASE64",
      "IOS_PROVISIONING_PROFILE_BASE64",
      "IOS_CERT_PASSWORD"
    ]
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Builds both platforms in parallel after health checks</span>
              </div>
            </Card>

            {/* Path-Based Trigger */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">Path-Based Build Trigger</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Only run build when relevant files change
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "build",
  "options": {
    "name": "Android Build",
    "triggers": {
      "branches": ["main", "develop"],
      "events": ["push"],
      "paths": [
        "android/**",
        "src/**",
        "package.json",
        "yarn.lock"
      ]
    },
    "build": {
      "platform": "android",
      "variant": "release"
    }
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Optimizes CI usage by only running when necessary</span>
              </div>
            </Card>

            {/* Matrix Node Versions */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">Multi-Node Version Testing</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Run tests across multiple Node.js versions
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "health-check",
  "options": {
    "name": "Node Version Matrix",
    "triggers": {
      "branches": ["main"],
      "events": ["push", "pull_request"]
    },
    "nodeVersions": [16, 18, 20],
    "packageManager": "npm"
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Ensures compatibility across Node versions</span>
              </div>
            </Card>

            {/* Custom Environment Variables */}
            <Card className="overflow-hidden">
              <div className="border-b p-5">
                <h3 className="font-semibold">Custom Environment Setup</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use custom environment variables in workflow
                </p>
              </div>
              <div className="bg-muted/50 p-5">
                <pre className="overflow-x-auto text-sm">
                  <code>
{`{
  "kind": "build",
  "options": {
    "name": "Production Build",
    "triggers": {
      "branches": ["main"],
      "events": ["push"]
    },
    "env": {
      "APP_ENV": "production",
      "API_URL": "https://api.example.com",
      "ENABLE_ANALYTICS": "true"
    },
    "build": {
      "platform": "android",
      "variant": "release"
    }
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="flex items-center gap-2 border-t p-4">
                <IconCheck className="h-4 w-4 text-green-500" />
                <span className="text-sm">Configure app behavior through environment variables</span>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Custom Storage Recipe */}
            <Card className="overflow-hidden" id="custom-storage">
              <div className="border-b p-5">
                <h3 className="font-semibold">Custom Storage Integration</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Implementing a custom artifact storage provider
                </p>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm">
                  To implement a custom storage provider, you need to:
                </p>
                <ol className="ml-6 list-decimal space-y-2 text-sm">
                  <li>Create a storage helper in <code>src/helpers/storage.ts</code></li>
                  <li>Add your custom storage option to the available options</li>
                  <li>Use it in your workflow configuration</li>
                </ol>
                <div className="rounded-lg bg-muted p-4 mt-4">
                  <h4 className="text-sm font-semibold">Example Implementation</h4>
                  <pre className="mt-2 overflow-x-auto text-xs">
                    <code>
{`// In src/helpers/storage.ts

// Add your custom storage function
export function createCustomStorageSteps(build: BuildOptions) {
  return [
    {
      name: "Upload to Custom Storage",
      run: \`
        # Your custom upload script here
        echo "Uploading to custom storage"
        # Example: Upload to S3
        aws s3 cp ./android/app/build/outputs/apk/release/*.apk s3://your-bucket/\${GITHUB_SHA}/
      \`
    },
    {
      name: "Add storage link",
      if: "success()",
      run: \`
        echo "::set-output name=artifact_url::https://your-storage-url/\${GITHUB_SHA}/app-release.apk"
      \`
    }
  ];
}

// Then update the createAndroidStorageSteps function
export function createAndroidStorageSteps(build: BuildOptions) {
  switch (build.storage) {
    case 'github':
      return createGithubStorageSteps(build);
    case 'custom':
      return createCustomStorageSteps(build);
    default:
      return [];
  }
}`}
                    </code>
                  </pre>
                </div>
                <div className="rounded-lg bg-muted p-4 mt-4">
                  <h4 className="text-sm font-semibold">Usage in Configuration</h4>
                  <pre className="mt-2 overflow-x-auto text-xs">
                    <code>
{`{
  "kind": "build",
  "options": {
    "name": "Custom Storage Build",
    "build": {
      "platform": "android",
      "variant": "release",
      "storage": "custom"
    },
    "secrets": [
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY"
    ]
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </Card>

            {/* Artifact Links Recipe */}
            <Card className="overflow-hidden" id="artifact-links">
              <div className="border-b p-5">
                <h3 className="font-semibold">Dynamic Artifact Links</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Creating links to build artifacts in PR comments
                </p>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm">
                  This recipe demonstrates how to create dynamic links to build artifacts in PR comments:
                </p>
                <div className="rounded-lg bg-muted p-4 mt-2">
                  <h4 className="text-sm font-semibold">Implementation in Notifications Helper</h4>
                  <pre className="mt-2 overflow-x-auto text-xs">
                    <code>
{`// In src/helpers/notifications.ts

export function createAndroidNotificationSteps(build: BuildOptions) {
  if (build.notification === 'pr-comment') {
    return [{
      name: "Find PR Number",
      if: "github.event_name == 'pull_request'",
      run: "echo PR_NUMBER=\${GITHUB_REF#refs/pull/} | sed 's/\\/merge$//' >> $GITHUB_ENV"
    }, {
      name: "Comment on PR",
      if: "github.event_name == 'pull_request'",
      uses: "actions/github-script@v6",
      with: {
        script: \`
          const artifactUrl = process.env.ARTIFACT_URL || 
            \`\${process.env.GITHUB_SERVER_URL}/\${process.env.GITHUB_REPOSITORY}/actions/runs/\${process.env.GITHUB_RUN_ID}\`;
          
          const body = \`✅ Android build completed successfully!
          
          📱 [Download APK](\${artifactUrl})
          
          *Build details:*
          - Branch: \${process.env.GITHUB_HEAD_REF}
          - Commit: \${process.env.GITHUB_SHA.substring(0, 7)}
          - Build variant: \${process.env.BUILD_VARIANT || 'release'}
          \`;
          
          github.rest.issues.createComment({
            issue_number: process.env.PR_NUMBER,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: body
          });
        \`
      }
    }];
  }
  
  return [];
}`}
                    </code>
                  </pre>
                </div>
                <div className="rounded-lg bg-muted p-4 mt-4">
                  <h4 className="text-sm font-semibold">Usage in Configuration</h4>
                  <pre className="mt-2 overflow-x-auto text-xs">
                    <code>
{`{
  "kind": "build",
  "options": {
    "name": "PR Preview Build",
    "triggers": {
      "events": ["pull_request"]
    },
    "build": {
      "platform": "android",
      "variant": "debug",
      "storage": "github",
      "notification": "pr-comment"
    }
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 p-6 text-center">
        <h3 className="font-semibold">Need a Custom Recipe?</h3>
        <p className="mt-2 text-muted-foreground">
          If you need a workflow for a specific use case that's not covered here, you can create a custom preset.
        </p>
        <p className="mt-4">
          <Link href="/docs/core-concepts#extension" className="text-primary hover:underline">
            Learn about extending the workflow generator →
          </Link>
        </p>
      </div>
    </div>
  );
}