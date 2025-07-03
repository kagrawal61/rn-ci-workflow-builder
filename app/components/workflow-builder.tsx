'use client';

import {
  createConfigFromFormValues,
  createDefaultBuildConfig,
  createDefaultHealthCheckConfig,
  generateWorkflowYaml,
} from '@/utils/workflow-service';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Database,
  PlayCircle,
  Settings2,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WorkflowForm, WorkflowFormValues } from './workflow-form';
import { YamlPreview } from './yaml-preview';

export function WorkflowBuilder() {
  const [formValues, setFormValues] = useState<WorkflowFormValues>(() => {
    // Set up default form values based on the default config
    const defaultConfig = createDefaultBuildConfig();

    return {
      // Preset selection
      preset: 'build',

      // Platform selection
      platform: 'github',

      // Basic settings
      name: defaultConfig.options?.name || 'React Native Static Analysis',

      // Trigger settings
      enablePushTrigger: !!defaultConfig.options?.triggers?.push,
      pushBranches:
        defaultConfig.options?.triggers?.push?.branches?.join(', ') || 'main',
      ignorePaths:
        defaultConfig.options?.triggers?.push?.ignorePaths?.join(', ') ||
        'docs/**, *.md',

      enablePrTrigger: !!defaultConfig.options?.triggers?.pullRequest,
      prTargetBranches:
        defaultConfig.options?.triggers?.pullRequest?.branches?.join(', ') ||
        'main',

      enableManualTrigger: !!defaultConfig.options?.triggers?.workflowDispatch,

      enableScheduleTrigger: false,
      cronExpression: '0 0 * * *', // Daily at midnight

      // Node version setting (single version) - ensure it's a number
      nodeVersion:
        typeof defaultConfig.options?.nodeVersions?.[0] === 'number'
          ? defaultConfig.options.nodeVersions[0]
          : typeof defaultConfig.options?.nodeVersions?.[0] === 'string'
            ? parseInt(defaultConfig.options.nodeVersions[0], 10)
            : 20,

      // Package manager
      packageManager: defaultConfig.options?.packageManager || 'yarn',

      // Cache settings
      cachePaths: '',
      cacheKey: '',

      // Environment variables and secrets
      envVars: {},
      secrets: [],

      // Build-specific settings (initially empty)
      buildPlatform: 'android',
      buildFlavor: 'develop',
      buildVariant: 'release',
      buildStorage: 'github',
      buildNotification: 'pr-comment',
      includeHealthCheck: true, // Will be renamed to includeStaticAnalysis in the future

      // Static analysis settings
      staticAnalysisNotification: 'pr-comment',
      typescriptCheck: true,
      eslintCheck: true,
      prettierCheck: true,
      unitTestsCheck: true,
    };
  });

  const [yamlContent, setYamlContent] = useState('');
  const [secretsSummary, setSecretsSummary] = useState<string | undefined>(
    undefined
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('configure');

  // Generate YAML when form values change or on initial load
  useEffect(() => {
    try {
      const config = createConfigFromFormValues(formValues);
      const result = generateWorkflowYaml(config);
      setYamlContent(result.yaml);
      setSecretsSummary(result.secretsSummary);
    } catch (error) {
      console.error('Error generating YAML:', error);
      // Keep the previous valid YAML
    }
  }, [formValues]);

  const handleFormChange = (newValues: Record<string, unknown>) => {
    // Check if preset changed
    if (newValues.preset && newValues.preset !== formValues.preset) {
      // Switch to new preset's defaults
      const defaultConfig =
        newValues.preset === 'build'
          ? createDefaultBuildConfig()
          : createDefaultHealthCheckConfig();

      // Update form values with defaults from the selected preset
      setFormValues((prev: WorkflowFormValues) => {
        const baseValues: WorkflowFormValues = {
          ...prev,
          name:
            defaultConfig.options?.name ||
            (newValues.preset === 'build'
              ? 'React Native Build Pipeline'
              : 'React Native Static Analysis'),
        };

        return { ...baseValues, ...newValues } as WorkflowFormValues;
      });
    } else {
      // Regular form update
      setFormValues(
        (prev: WorkflowFormValues) =>
          ({
            ...prev,
            ...newValues,
          }) as WorkflowFormValues
      );
    }
  };

  const handleGenerateClick = () => {
    setIsGenerating(true);

    try {
      const config = createConfigFromFormValues(formValues);
      const result = generateWorkflowYaml(config);
      setYamlContent(result.yaml);
      setSecretsSummary(result.secretsSummary);
      setActiveTab('preview');
      
      // Scroll to the top of the workflow builder section when switching tabs
      const workflowBuilderSection = document.getElementById('workflow-builder');
      if (workflowBuilderSection) {
        workflowBuilderSection.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error generating YAML:', error);
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
          <h2 className="text-3xl font-bold tracking-tight">
            Workflow Builder
          </h2>
          <p className="mt-3 text-muted-foreground">
            Configure your React Native CI/CD pipeline with a few simple steps.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mx-auto"
        >
          <TabsList className="mb-8 grid w-full grid-cols-2">
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
            <WorkflowForm values={formValues} onChange={handleFormChange} />
            <div className="mt-8 flex justify-end">
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
                    Your{' '}
                    {formValues.platform === 'bitrise'
                      ? 'Bitrise'
                      : 'GitHub Actions'}{' '}
                    workflow is ready. Copy it and add to your repository.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab('configure');
                  // Scroll to the top of the workflow builder section when switching tabs
                  const workflowBuilderSection = document.getElementById('workflow-builder');
                  if (workflowBuilderSection) {
                    workflowBuilderSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2"
              >
                <Settings2 className="h-4 w-4" /> Edit Configuration
              </Button>
            </div>

            <YamlPreview
              yamlContent={yamlContent}
              fileName={
                formValues.platform === 'bitrise'
                  ? 'bitrise.yml'
                  : `${String(formValues.name || '')
                      .toLowerCase()
                      .replace(/\s+/g, '-')}.yml`
              }
              secretsSummary={secretsSummary}
            />

            <div className="mt-8 rounded-lg border bg-card p-4">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
                <Database className="h-5 w-5 text-primary" />
                Next Steps
              </h3>
              <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
                <li>
                  Copy the generated workflow to a <code>.yml</code> file in
                  your repository
                </li>
                <li>
                  Place it in the <code>.github/workflows/</code> directory
                </li>
                <li>Commit and push to your GitHub repository</li>
                <li>
                  GitHub Actions will automatically run your workflow based on
                  the triggers
                </li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
}
