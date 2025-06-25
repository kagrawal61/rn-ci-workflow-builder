"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings2, PlayCircle, ChevronRight, Database, Zap } from "lucide-react";
import { 
  createConfigFromFormValues,
  createDefaultHealthCheckConfig,
  createDefaultBuildConfig,
  generateWorkflowYaml 
} from "@/utils/workflow-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { YamlPreview } from "./yaml-preview";
import { WorkflowForm } from "./workflow-form";

export function WorkflowBuilder() {
  const [formValues, setFormValues] = useState<any>(() => {
    // Set up default form values based on the default config
    const defaultConfig = createDefaultHealthCheckConfig();
    
    return {
      // Preset selection
      preset: "health-check",
      
      // Basic settings
      name: defaultConfig.options?.name || "React Native Health Check",
      
      // Trigger settings
      enablePushTrigger: !!defaultConfig.options?.triggers?.push,
      pushBranches: defaultConfig.options?.triggers?.push?.branches?.join(", ") || "main",
      ignorePaths: defaultConfig.options?.triggers?.push?.ignorePaths?.join(", ") || "docs/**, *.md",
      
      enablePrTrigger: !!defaultConfig.options?.triggers?.pullRequest,
      prTargetBranches: defaultConfig.options?.triggers?.pullRequest?.branches?.join(", ") || "main",
      
      enableManualTrigger: !!defaultConfig.options?.triggers?.workflowDispatch,
      
      enableScheduleTrigger: false,
      cronExpression: "0 0 * * *", // Daily at midnight
      
      // Node version setting (single version)
      nodeVersion: defaultConfig.options?.nodeVersions?.[0] || 20,
      
      // Package manager
      packageManager: defaultConfig.options?.packageManager || "yarn",
      
      // Runner OS
      runsOn: defaultConfig.options?.runsOn || "ubuntu-latest",
      
      // Cache settings
      cachePaths: "",
      cacheKey: "",
      
      // Environment variables and secrets
      envVars: {},
      secrets: [],
      
      // Build-specific settings (initially empty)
      buildPlatform: "both",
      buildFlavor: "develop",
      buildVariant: "debug",
      buildStorage: "github",
      buildNotification: "pr-comment",
      includeHealthCheck: true
    };
  });
  
  const [yamlContent, setYamlContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("configure");

  // Generate YAML when form values change or on initial load
  useEffect(() => {
    try {
      const config = createConfigFromFormValues(formValues);
      const yaml = generateWorkflowYaml(config);
      setYamlContent(yaml);
    } catch (error) {
      console.error("Error generating YAML:", error);
      // Keep the previous valid YAML
    }
  }, [formValues]);

  const handleFormChange = (newValues: any) => {
    // Check if preset changed
    if (newValues.preset && newValues.preset !== formValues.preset) {
      // Switch to new preset's defaults
      const defaultConfig = newValues.preset === 'build' 
        ? createDefaultBuildConfig() 
        : createDefaultHealthCheckConfig();
      
      // Update form values with defaults from the selected preset
      setFormValues((prev: any) => {
        const baseValues = {
          ...prev,
          name: defaultConfig.options?.name || (newValues.preset === 'build' ? 'React Native Build Pipeline' : 'React Native Health Check'),
        };
        
        return { ...baseValues, ...newValues };
      });
    } else {
      // Regular form update
      setFormValues((prev: any) => ({ ...prev, ...newValues }));
    }
  };

  const handleGenerateClick = () => {
    setIsGenerating(true);
    
    try {
      const config = createConfigFromFormValues(formValues);
      const yaml = generateWorkflowYaml(config);
      setYamlContent(yaml);
      setActiveTab("preview");
    } catch (error) {
      console.error("Error generating YAML:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="workflow-builder" className="container my-16 scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Workflow Builder</h2>
          <p className="mt-3 text-muted-foreground">
            Configure your React Native CI/CD pipeline with a few simple steps.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="configure" className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <PlayCircle className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="configure" className="space-y-6">
            <WorkflowForm
              values={formValues}
              onChange={handleFormChange}
            />
            <div className="flex justify-end mt-8">
              <Button 
                onClick={handleGenerateClick}
                className="flex items-center gap-2"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    Preview Workflow <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="preview" className="space-y-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Workflow YAML</h3>
                  <p className="text-sm text-muted-foreground">
                    Your GitHub Actions workflow is ready. Copy it and add to your repository.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("configure")}
                className="flex items-center gap-2"
              >
                <Settings2 className="h-4 w-4" /> Edit Configuration
              </Button>
            </div>
            
            <YamlPreview 
              yamlContent={yamlContent} 
              fileName={`${formValues.name.toLowerCase().replace(/\s+/g, '-')}.yml`}
            />
            
            <div className="rounded-lg border bg-card p-4 mt-8">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Next Steps
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Copy the generated workflow to a <code>.yml</code> file in your repository</li>
                <li>Place it in the <code>.github/workflows/</code> directory</li>
                <li>Commit and push to your GitHub repository</li>
                <li>GitHub Actions will automatically run your workflow based on the triggers</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
}