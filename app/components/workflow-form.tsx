"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Info, Plus, Trash } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface WorkflowFormProps {
  values: any;
  onChange: (values: any) => void;
}

export function WorkflowForm({ values, onChange }: WorkflowFormProps) {
  const nodeVersionOptions = [14, 16, 18, 20];
  const runnerOptions = ["ubuntu-latest", "macos-latest"];
  
  const [envVarKey, setEnvVarKey] = useState("");
  const [envVarValue, setEnvVarValue] = useState("");
  const [secretName, setSecretName] = useState("");
  
  const handleInputChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };
  
  const handleAddEnvVar = () => {
    if (envVarKey.trim() === "") return;
    
    const updatedEnvVars = { 
      ...values.envVars, 
      [envVarKey.trim()]: envVarValue.trim() 
    };
    
    onChange({ envVars: updatedEnvVars });
    setEnvVarKey("");
    setEnvVarValue("");
  };
  
  const handleDeleteEnvVar = (key: string) => {
    const updatedEnvVars = { ...values.envVars };
    delete updatedEnvVars[key];
    onChange({ envVars: updatedEnvVars });
  };
  
  const handleAddSecret = () => {
    if (secretName.trim() === "" || values.secrets.includes(secretName.trim())) return;
    
    const updatedSecrets = [...values.secrets, secretName.trim()];
    onChange({ secrets: updatedSecrets });
    setSecretName("");
  };
  
  const handleDeleteSecret = (secret: string) => {
    const updatedSecrets = values.secrets.filter((s: string) => s !== secret);
    onChange({ secrets: updatedSecrets });
  };
  
  // Single Node.js version selection handler
  const handleNodeVersionChange = (version: string) => {
    onChange({ nodeVersion: parseInt(version, 10) });
  };

  return (
    <TooltipProvider>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Basic Settings</CardTitle>
            <CardDescription>
              Configure the basic properties of your GitHub Actions workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="preset">Workflow Preset</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Select the type of workflow to generate
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select 
                value={values.preset || "health-check"}
                onValueChange={(value) => handleInputChange("preset", value)}
              >
                <SelectTrigger id="preset">
                  <SelectValue placeholder="Select workflow preset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="health-check">Health Check</SelectItem>
                  <SelectItem value="build">Build Pipeline</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {values.preset === "build" 
                  ? "Generate a workflow for building Android/iOS apps" 
                  : "Generate a workflow for code quality checks"}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="name">Workflow Name</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Name that appears in GitHub Actions UI
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input 
                id="name" 
                value={values.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={values.preset === "build" ? "React Native Build Pipeline" : "React Native Health Check"}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="package-manager">Package Manager</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Select the package manager used in your project
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select 
                value={values.packageManager}
                onValueChange={(value) => handleInputChange("packageManager", value)}
              >
                <SelectTrigger id="package-manager">
                  <SelectValue placeholder="Select package manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yarn">Yarn</SelectItem>
                  <SelectItem value="npm">npm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="runner-os">Runner OS</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    The virtual environment to run the workflow
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select 
                value={values.runsOn}
                onValueChange={(value) => handleInputChange("runsOn", value)}
              >
                <SelectTrigger id="runner-os">
                  <SelectValue placeholder="Select runner OS" />
                </SelectTrigger>
                <SelectContent>
                  {runnerOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="node-version">Node.js Version</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Select the Node.js version to use
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select 
                value={values.nodeVersion?.toString() || "20"}
                onValueChange={handleNodeVersionChange}
              >
                <SelectTrigger id="node-version">
                  <SelectValue placeholder="Select Node.js version" />
                </SelectTrigger>
                <SelectContent>
                  {nodeVersionOptions.map((version) => (
                    <SelectItem key={version} value={version.toString()}>
                      Node {version}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Build Settings - Only shown when build preset is selected */}
        {values.preset === "build" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl">Build Configuration</CardTitle>
              <CardDescription>
                Configure the build options for your React Native app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platform Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="build-platform">Platform</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Select which platform(s) to build
                    </TooltipContent>
                  </Tooltip>
                </div>
                <RadioGroup 
                  value={values.buildPlatform || "both"} 
                  onValueChange={(value) => handleInputChange("buildPlatform", value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="android" id="platform-android" />
                    <Label htmlFor="platform-android">Android only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ios" id="platform-ios" />
                    <Label htmlFor="platform-ios">iOS only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="platform-both" />
                    <Label htmlFor="platform-both">Both platforms</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Flavor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="build-flavor">App Flavor</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Select the app flavor to build
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select 
                  value={values.buildFlavor || "develop"}
                  onValueChange={(value) => handleInputChange("buildFlavor", value)}
                >
                  <SelectTrigger id="build-flavor">
                    <SelectValue placeholder="Select app flavor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prod">Production</SelectItem>
                    <SelectItem value="develop">Development</SelectItem>
                    <SelectItem value="stage">Staging</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Variant */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="build-variant">Build Variant</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Debug builds are faster but release builds are optimized
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select 
                  value={values.buildVariant || "debug"}
                  onValueChange={(value) => handleInputChange("buildVariant", value)}
                >
                  <SelectTrigger id="build-variant">
                    <SelectValue placeholder="Select build variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="release">Release</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Storage Solution */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="build-storage">Artifact Storage</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      Where to store build artifacts
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select 
                  value={values.buildStorage || "github"}
                  onValueChange={(value) => handleInputChange("buildStorage", value)}
                >
                  <SelectTrigger id="build-storage">
                    <SelectValue placeholder="Select storage solution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">GitHub Artifacts</SelectItem>
                    <SelectItem value="drive">Google Drive (via rclone)</SelectItem>
                    <SelectItem value="firebase">Firebase App Distribution</SelectItem>
                    <SelectItem value="s3">Amazon S3 (via rclone)</SelectItem>
                  </SelectContent>
                </Select>
                {/* Storage-specific help text */}
                <div className="rounded-md bg-muted p-3 text-xs">
                  {values.buildStorage === "github" && (
                    <div>
                      <p className="font-medium mb-1">GitHub Artifacts</p>
                      <p className="text-muted-foreground">No additional secrets required. Artifacts will be stored directly in GitHub for 30 days.</p>
                    </div>
                  )}
                  {values.buildStorage === "drive" && (
                    <div>
                      <p className="font-medium mb-1">Google Drive (via rclone)</p>
                      <p className="text-muted-foreground mb-1">Required secrets (one of these authentication methods):</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><code>GDRIVE_SERVICE_ACCOUNT_JSON</code>: Google service account JSON file content (Recommended for CI)</li>
                        <li><strong>OR</strong></li>
                        <li><code>GDRIVE_REFRESH_TOKEN</code>: OAuth refresh token for authentication</li>
                      </ul>
                      <p className="text-muted-foreground mt-2 mb-1">Optional secrets:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><code>GDRIVE_CLIENT_ID</code>: OAuth client ID (only needed if using refresh token)</li>
                        <li><code>GDRIVE_CLIENT_SECRET</code>: OAuth client secret (only needed if using refresh token)</li>
                        <li><code>GDRIVE_FOLDER_ID</code>: ID of the Google Drive folder (defaults to "react-native-builds")</li>
                      </ul>
                    </div>
                  )}
                  {values.buildStorage === "firebase" && (
                    <div>
                      <p className="font-medium mb-1">Firebase App Distribution</p>
                      <p className="text-muted-foreground mb-1">Required secrets:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><code>FIREBASE_APP_ID_ANDROID</code>: Firebase Android app ID</li>
                        <li><code>FIREBASE_APP_ID_IOS</code>: Firebase iOS app ID</li>
                        <li><code>FIREBASE_SERVICE_ACCOUNT</code>: Firebase service account JSON (base64 encoded)</li>
                        <li><code>FIREBASE_TEST_GROUPS</code>: (Optional) Test groups to distribute to (default: "testers")</li>
                      </ul>
                    </div>
                  )}
                  {values.buildStorage === "s3" && (
                    <div>
                      <p className="font-medium mb-1">Amazon S3 (via rclone)</p>
                      <p className="text-muted-foreground mb-1">Required secrets:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><code>AWS_ACCESS_KEY_ID</code>: AWS access key with S3 permissions</li>
                        <li><code>AWS_SECRET_ACCESS_KEY</code>: AWS secret access key</li>
                      </ul>
                      <p className="text-muted-foreground mt-2 mb-1">Optional secrets:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li><code>AWS_S3_BUCKET</code>: Name of the S3 bucket (defaults to "rn-artifacts" if not provided)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Notification */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="build-notification">Notifications</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      How to notify about build results
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select 
                  value={values.buildNotification || "pr-comment"}
                  onValueChange={(value) => handleInputChange("buildNotification", value)}
                >
                  <SelectTrigger id="build-notification">
                    <SelectValue placeholder="Select notification method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pr-comment">PR Comment</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="both">Both PR Comment & Slack</SelectItem>
                    <SelectItem value="none">No Notifications</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Include Health Check */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="include-health-check"
                  checked={values.includeHealthCheck}
                  onCheckedChange={(checked) => handleInputChange("includeHealthCheck", checked)}
                />
                <div className="grid gap-1">
                  <Label htmlFor="include-health-check">
                    Include Health Check Steps
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Run linting, typechecking and tests before building
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Accordion type="multiple" defaultValue={["triggers"]}>
          <AccordionItem value="triggers">
            <AccordionTrigger>Trigger Settings</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="push-trigger">Push Trigger</Label>
                    <span className="text-sm text-muted-foreground">
                      Run on push to specified branches
                    </span>
                  </div>
                  <Switch
                    id="push-trigger"
                    checked={values.enablePushTrigger}
                    onCheckedChange={(checked) => handleInputChange("enablePushTrigger", checked)}
                  />
                </div>
                
                {values.enablePushTrigger && (
                  <motion.div 
                    className="space-y-4 rounded-md border p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="push-branches">Branches</Label>
                      <Input
                        id="push-branches"
                        value={values.pushBranches}
                        onChange={(e) => handleInputChange("pushBranches", e.target.value)}
                        placeholder="main, develop, feature/*"
                      />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated list of branches to trigger on
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ignore-paths">Ignore Paths</Label>
                      <Input
                        id="ignore-paths"
                        value={values.ignorePaths}
                        onChange={(e) => handleInputChange("ignorePaths", e.target.value)}
                        placeholder="docs/**, *.md"
                      />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated list of glob patterns to ignore
                      </p>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="pr-trigger">Pull Request Trigger</Label>
                    <span className="text-sm text-muted-foreground">
                      Run on pull requests to specified branches
                    </span>
                  </div>
                  <Switch
                    id="pr-trigger"
                    checked={values.enablePrTrigger}
                    onCheckedChange={(checked) => handleInputChange("enablePrTrigger", checked)}
                  />
                </div>
                
                {values.enablePrTrigger && (
                  <motion.div 
                    className="space-y-4 rounded-md border p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="pr-target-branches">Target Branches</Label>
                      <Input
                        id="pr-target-branches"
                        value={values.prTargetBranches}
                        onChange={(e) => handleInputChange("prTargetBranches", e.target.value)}
                        placeholder="main, develop"
                      />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated list of target branches to trigger on
                      </p>
                    </div>
                  </motion.div>
                )}
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="manual-trigger">Manual Trigger</Label>
                    <span className="text-sm text-muted-foreground">
                      Allow manual workflow runs from GitHub UI
                    </span>
                  </div>
                  <Switch
                    id="manual-trigger"
                    checked={values.enableManualTrigger}
                    onCheckedChange={(checked) => handleInputChange("enableManualTrigger", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="schedule-trigger">Schedule Trigger</Label>
                    <span className="text-sm text-muted-foreground">
                      Run on a schedule using cron syntax
                    </span>
                  </div>
                  <Switch
                    id="schedule-trigger"
                    checked={values.enableScheduleTrigger}
                    onCheckedChange={(checked) => handleInputChange("enableScheduleTrigger", checked)}
                  />
                </div>
                
                {values.enableScheduleTrigger && (
                  <motion.div 
                    className="space-y-4 rounded-md border p-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="cron-expression">Cron Expression</Label>
                      <Input
                        id="cron-expression"
                        value={values.cronExpression}
                        onChange={(e) => handleInputChange("cronExpression", e.target.value)}
                        placeholder="0 0 * * *"
                      />
                      <p className="text-xs text-muted-foreground">
                        Cron expression for schedule (e.g., "0 0 * * *" for daily at midnight)
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="env">
            <AccordionTrigger>Environment & Secrets</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Environment Variables</h4>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Variable name"
                      value={envVarKey}
                      onChange={(e) => setEnvVarKey(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Variable value"
                      value={envVarValue}
                      onChange={(e) => setEnvVarValue(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddEnvVar}
                    disabled={!envVarKey.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {Object.keys(values.envVars).length > 0 ? (
                  <motion.div
                    className="space-y-2 rounded-md border p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {Object.entries(values.envVars).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-sm">{key}</span>
                          <span className="mx-2 text-muted-foreground">=</span>
                          <span className="font-mono text-sm text-muted-foreground">
                            {typeof value === 'string' && value.length > 20
                              ? `${value.substring(0, 20)}...`
                              : String(value)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEnvVar(key)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No environment variables defined.
                  </p>
                )}

                <h4 className="text-sm font-medium pt-4">GitHub Secrets</h4>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Secret name"
                      value={secretName}
                      onChange={(e) => setSecretName(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddSecret}
                    disabled={!secretName.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {values.secrets.length > 0 ? (
                  <motion.div
                    className="space-y-2 rounded-md border p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {values.secrets.map((secret: string) => (
                      <div key={secret} className="flex items-center justify-between">
                        <div className="font-mono text-sm">{secret}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSecret(secret)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No secrets defined. Secrets must be configured in your GitHub repository settings.
                  </p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </TooltipProvider>
  );
}