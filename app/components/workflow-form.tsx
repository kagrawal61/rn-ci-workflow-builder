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
  const runnerOptions = ["ubuntu-latest", "macos-latest", "windows-latest"];
  
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
  
  const toggleNodeVersion = (version: number) => {
    const updatedVersions = values.nodeVersions.includes(version)
      ? values.nodeVersions.filter((v: number) => v !== version)
      : [...values.nodeVersions, version];
      
    // Ensure at least one version is selected
    if (updatedVersions.length === 0) return;
    
    onChange({ nodeVersions: updatedVersions });
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
                placeholder="React Native Health Check"
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
                <Label>Node.js Versions</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full p-0">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="sr-only">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Select one or more Node.js versions to test with
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                {nodeVersionOptions.map((version) => (
                  <Button
                    key={version}
                    type="button"
                    variant={values.nodeVersions.includes(version) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleNodeVersion(version)}
                    className="transition-all"
                  >
                    Node {version}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
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
          
          <AccordionItem value="skip">
            <AccordionTrigger>Skip Conditions</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="enable-skip">Enable Skip Conditions</Label>
                  <span className="text-sm text-muted-foreground">
                    Define conditions to skip workflow execution
                  </span>
                </div>
                <Switch
                  id="enable-skip"
                  checked={values.enableSkipConditions}
                  onCheckedChange={(checked) => handleInputChange("enableSkipConditions", checked)}
                />
              </div>
              
              {values.enableSkipConditions && (
                <motion.div 
                  className="space-y-4 rounded-md border p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="skip-commit">Skip if Commit Message Contains</Label>
                    <Input
                      id="skip-commit"
                      value={values.skipCommitMessage}
                      onChange={(e) => handleInputChange("skipCommitMessage", e.target.value)}
                      placeholder="[skip ci]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skip-pr-title">Skip if PR Title Contains</Label>
                    <Input
                      id="skip-pr-title"
                      value={values.skipPrTitle}
                      onChange={(e) => handleInputChange("skipPrTitle", e.target.value)}
                      placeholder="[wip]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skip-pr-label">Skip if PR has Label</Label>
                    <Input
                      id="skip-pr-label"
                      value={values.skipPrLabel}
                      onChange={(e) => handleInputChange("skipPrLabel", e.target.value)}
                      placeholder="skip-ci"
                    />
                  </div>
                </motion.div>
              )}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="cache">
            <AccordionTrigger>Cache Configuration</AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="enable-cache">Enable Caching</Label>
                  <span className="text-sm text-muted-foreground">
                    Cache dependencies to speed up workflow runs
                  </span>
                </div>
                <Switch
                  id="enable-cache"
                  checked={values.enableCache}
                  onCheckedChange={(checked) => handleInputChange("enableCache", checked)}
                />
              </div>
              
              {values.enableCache && (
                <motion.div 
                  className="space-y-4 rounded-md border p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="cache-paths">Custom Cache Paths (Optional)</Label>
                    <Input
                      id="cache-paths"
                      value={values.cachePaths}
                      onChange={(e) => handleInputChange("cachePaths", e.target.value)}
                      placeholder="node_modules/.cache, ~/.cache/yarn"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of paths to cache. Leave empty for default package manager cache.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cache-key">Custom Cache Key (Optional)</Label>
                    <Input
                      id="cache-key"
                      value={values.cacheKey}
                      onChange={(e) => handleInputChange("cacheKey", e.target.value)}
                      placeholder="${{ runner.os }}-node-${{ hashFiles('**/yarn.lock') }}"
                    />
                    <p className="text-xs text-muted-foreground">
                      Custom cache key expression. Leave empty for default key.
                    </p>
                  </div>
                </motion.div>
              )}
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
                              : value}
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