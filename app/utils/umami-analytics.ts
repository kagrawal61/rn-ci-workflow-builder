'use client';

// Type definitions for Umami window object
declare global {
  interface Window {
    umami?: {
      track: (event_name: string, event_data?: Record<string, unknown>, url?: string, website_id?: string) => void;
      trackView: (url?: string, referrer?: string, website_id?: string) => void;
    };
  }
}

/**
 * Check if Umami is loaded
 */
const isUmamiAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.umami;
};

// Analytics events (same as the ones used in analytics.ts for consistency)
export const UmamiEvents = {
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
 * Generic track function for Umami
 */
export function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (isUmamiAvailable()) {
    window.umami?.track(eventName, eventData);
  }
}

/**
 * Track a workflow generation event
 */
export function trackWorkflowGenerated(props: WorkflowGeneratedProps) {
  trackEvent(UmamiEvents.WORKFLOW_GENERATED, props);
}

/**
 * Track a workflow download event
 */
export function trackWorkflowDownloaded(props: WorkflowDownloadedProps) {
  trackEvent(UmamiEvents.WORKFLOW_DOWNLOADED, props);
}

/**
 * Track when the user copies the workflow YAML
 */
export function trackWorkflowCopied(props: WorkflowDownloadedProps) {
  trackEvent(UmamiEvents.WORKFLOW_COPIED, props);
}

/**
 * Track when a form field changes
 */
export function trackFormFieldChanged(props: FormFieldChangedProps) {
  trackEvent(UmamiEvents.FORM_FIELD_CHANGED, props);
}

/**
 * Track when the platform selection changes
 */
export function trackPlatformChanged(platform: string) {
  trackEvent(UmamiEvents.PLATFORM_CHANGED, { platform });
}

/**
 * Track when the preset selection changes
 */
export function trackPresetChanged(preset: string) {
  trackEvent(UmamiEvents.PRESET_CHANGED, { preset });
}

/**
 * Track when a tab changes
 */
export function trackTabChanged(props: TabChangedProps) {
  trackEvent(UmamiEvents.TAB_CHANGED, props);
}

/**
 * Track when a docs page is viewed
 */
export function trackDocsViewed(props: DocsViewedProps) {
  trackEvent(UmamiEvents.DOCS_VIEWED, props);
}

/**
 * Track when the theme changes
 */
export function trackThemeChanged(props: ThemeChangedProps) {
  trackEvent(UmamiEvents.THEME_CHANGED, props);
}

/**
 * Track a page view (useful for single page applications)
 */
export function trackPageView(url?: string, referrer?: string) {
  if (isUmamiAvailable()) {
    window.umami?.trackView(url, referrer);
  }
}