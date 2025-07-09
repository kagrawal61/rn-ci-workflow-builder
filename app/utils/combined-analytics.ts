'use client';

import * as VercelAnalytics from './analytics';
import * as UmamiAnalytics from './umami-analytics';

// Type definitions
type WorkflowGeneratedProps = {
  platform: string;
  preset: string;
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
 * Track a workflow generation event across all analytics platforms
 */
export function trackWorkflowGenerated(props: WorkflowGeneratedProps) {
  VercelAnalytics.trackWorkflowGenerated(props);
  UmamiAnalytics.trackWorkflowGenerated(props);
}

/**
 * Track a workflow download event across all analytics platforms
 */
export function trackWorkflowDownloaded(props: WorkflowDownloadedProps) {
  VercelAnalytics.trackWorkflowDownloaded(props);
  UmamiAnalytics.trackWorkflowDownloaded(props);
}

/**
 * Track when the user copies the workflow YAML across all analytics platforms
 */
export function trackWorkflowCopied(props: WorkflowDownloadedProps) {
  VercelAnalytics.trackWorkflowCopied(props);
  UmamiAnalytics.trackWorkflowCopied(props);
}

/**
 * Track when a form field changes across all analytics platforms
 */
export function trackFormFieldChanged(props: FormFieldChangedProps) {
  VercelAnalytics.trackFormFieldChanged(props);
  UmamiAnalytics.trackFormFieldChanged(props);
}

/**
 * Track when the platform selection changes across all analytics platforms
 */
export function trackPlatformChanged(platform: string) {
  VercelAnalytics.trackPlatformChanged(platform);
  UmamiAnalytics.trackPlatformChanged(platform);
}

/**
 * Track when the preset selection changes across all analytics platforms
 */
export function trackPresetChanged(preset: string) {
  VercelAnalytics.trackPresetChanged(preset);
  UmamiAnalytics.trackPresetChanged(preset);
}

/**
 * Track when a tab changes across all analytics platforms
 */
export function trackTabChanged(props: TabChangedProps) {
  VercelAnalytics.trackTabChanged(props);
  UmamiAnalytics.trackTabChanged(props);
}

/**
 * Track when a docs page is viewed across all analytics platforms
 */
export function trackDocsViewed(props: DocsViewedProps) {
  VercelAnalytics.trackDocsViewed(props);
  UmamiAnalytics.trackDocsViewed(props);
}

/**
 * Track when the theme changes across all analytics platforms
 */
export function trackThemeChanged(props: ThemeChangedProps) {
  VercelAnalytics.trackThemeChanged(props);
  UmamiAnalytics.trackThemeChanged(props);
}

// Re-export analytics events for convenience
export const AnalyticsEvents = VercelAnalytics.AnalyticsEvents;