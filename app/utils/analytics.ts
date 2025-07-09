'use client';

import { track } from '@vercel/analytics';

// Analytics events
export const AnalyticsEvents = {
  // Workflow Generation Events
  WORKFLOW_GENERATED: 'workflow_generated',
  WORKFLOW_DOWNLOADED: 'workflow_downloaded',
  WORKFLOW_COPIED: 'workflow_copied',
  
  // Form Interaction Events
  FORM_FIELD_CHANGED: 'form_field_changed',
  PLATFORM_CHANGED: 'platform_changed',
  PRESET_CHANGED: 'preset_changed',
  
  // Navigation Events
  TAB_CHANGED: 'tab_changed',
  DOCS_VIEWED: 'docs_viewed',
  
  // UI Interaction Events
  THEME_CHANGED: 'theme_changed'
};

type WorkflowGeneratedProps = {
  platform: string;
  preset: string;
  framework?: string;
  buildPlatform?: string;
  buildVariant?: string;
};

type WorkflowDownloadedProps = {
  platform: string;
  preset: string;
  fileName: string;
};

type FormFieldChangedProps = {
  field: string;
  value: string | boolean | number;
};

type TabChangedProps = {
  tab: string;
};

type DocsViewedProps = {
  page: string;
};

type ThemeChangedProps = {
  theme: string;
};

/**
 * Track a workflow generation event
 */
export function trackWorkflowGenerated(props: WorkflowGeneratedProps) {
  track(AnalyticsEvents.WORKFLOW_GENERATED, props);
}

/**
 * Track a workflow download event
 */
export function trackWorkflowDownloaded(props: WorkflowDownloadedProps) {
  track(AnalyticsEvents.WORKFLOW_DOWNLOADED, props);
}

/**
 * Track when the user copies the workflow YAML
 */
export function trackWorkflowCopied(props: WorkflowDownloadedProps) {
  track(AnalyticsEvents.WORKFLOW_COPIED, props);
}

/**
 * Track when a form field changes
 */
export function trackFormFieldChanged(props: FormFieldChangedProps) {
  track(AnalyticsEvents.FORM_FIELD_CHANGED, props);
}

/**
 * Track when the platform selection changes
 */
export function trackPlatformChanged(platform: string) {
  track(AnalyticsEvents.PLATFORM_CHANGED, { platform });
}

/**
 * Track when the preset selection changes
 */
export function trackPresetChanged(preset: string) {
  track(AnalyticsEvents.PRESET_CHANGED, { preset });
}

/**
 * Track when a tab changes
 */
export function trackTabChanged(props: TabChangedProps) {
  track(AnalyticsEvents.TAB_CHANGED, props);
}

/**
 * Track when a docs page is viewed
 */
export function trackDocsViewed(props: DocsViewedProps) {
  track(AnalyticsEvents.DOCS_VIEWED, props);
}

/**
 * Track when the theme changes
 */
export function trackThemeChanged(props: ThemeChangedProps) {
  track(AnalyticsEvents.THEME_CHANGED, props);
}