'use client';

import { motion } from 'framer-motion';
import { Copy, FileJson } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  prism,
  atomDark,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { trackWorkflowCopied, trackWorkflowDownloaded } from '@/utils/analytics';

interface YamlPreviewProps {
  yamlContent: string;
  fileName?: string;
  secretsSummary?: string;
}

export function YamlPreview({
  yamlContent,
  fileName = 'workflow.yml',
  secretsSummary,
}: YamlPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  // Ensure theme is available on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate and format YAML
  const formattedYaml = (() => {
    try {
      // Parse and stringify to ensure proper formatting
      return yamlContent;
    } catch (error) {
      console.error('Invalid YAML:', error);
      return yamlContent; // Return original if there's a parsing error
    }
  })();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedYaml).then(
      () => {
        setCopied(true);
        toast.success('YAML copied to clipboard!');
        
        // Track copy event
        const platform = fileName.includes('bitrise') ? 'bitrise' : 'github';
        const preset = fileName.toLowerCase().includes('build') ? 'build' : 'static-analysis';
        trackWorkflowCopied({
          platform,
          preset,
          fileName
        });
        
        setTimeout(() => setCopied(false), 2000);
      },
      err => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy YAML');
      }
    );
  };

  // Download YAML file
  const downloadYaml = () => {
    const blob = new Blob([formattedYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${fileName}`);
    
    // Track download event
    const platform = fileName.includes('bitrise') ? 'bitrise' : 'github';
    const preset = fileName.toLowerCase().includes('build') ? 'build' : 'static-analysis';
    trackWorkflowDownloaded({
      platform,
      preset,
      fileName
    });
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="relative rounded-lg border bg-card shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between rounded-t-lg border-b bg-muted p-3">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{fileName}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={copyToClipboard}
          >
            <Copy className={`h-4 w-4 ${copied ? 'text-green-500' : ''}`} />
            <span className="sr-only">Copy code</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={downloadYaml}
          >
            Download
          </Button>
        </div>
      </div>
      <div
        className="max-h-[500px] overflow-auto rounded-b-lg border p-0"
        style={{ backgroundColor: theme === 'dark' ? '#1e1e2e' : '#ffffff' }}
      >
        <SyntaxHighlighter
          language="yaml"
          style={theme === 'dark' ? atomDark : prism}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '14px',
            lineHeight: '1.5',
            padding: '16px',
            background: theme === 'dark' ? '#1e1e2e' : '#ffffff',
            color: theme === 'dark' ? '#f8f8f2' : '#333333',
          }}
          wrapLongLines
          wrapLines
          showLineNumbers
          lineNumberStyle={{
            minWidth: '40px',
            textAlign: 'right',
            opacity: 0.6,
            paddingRight: '12px',
            marginRight: '12px',
            borderRight:
              theme === 'dark' ? '1px solid #2e2e3e' : '1px solid #d0d0d0',
          }}
          codeTagProps={{
            style: {
              display: 'block',
              background: 'none',
            },
          }}
        >
          {formattedYaml}
        </SyntaxHighlighter>
      </div>

      {secretsSummary && (
        <div className="mt-6 rounded-lg border bg-card shadow-sm">
          <div className="flex items-center gap-2 rounded-t-lg border-b bg-muted p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span className="text-sm font-medium">Required Secrets</span>
          </div>
          <div className="p-4 text-sm">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {secretsSummary.split('\n').map((line, i) => {
                // Format headings
                if (line.startsWith('##')) {
                  return (
                    <h2 key={i} className="mb-2 mt-4 text-lg font-medium">
                      {line.replace(/^##\s+/, '')}
                    </h2>
                  );
                } else if (line.startsWith('###')) {
                  return (
                    <h3 key={i} className="text-md mb-1 mt-3 font-medium">
                      {line.replace(/^###\s+/, '')}
                    </h3>
                  );
                }
                // Format list items
                else if (line.startsWith('-')) {
                  const match = line.match(/^-\s+`([^`]+)`:\s+(.+)/);
                  if (match) {
                    return (
                      <div key={i} className="mb-2 flex">
                        <span className="mr-2 font-mono font-medium text-primary">
                          {match[1]}:
                        </span>
                        <span>{match[2]}</span>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  );
                }
                // Regular paragraphs
                else if (line.trim() !== '') {
                  return (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  );
                }
                return null;
              })}

              {secretsSummary ===
                'No secrets required for this configuration.' && (
                <p>
                  This workflow doesn't require any additional GitHub secrets.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
