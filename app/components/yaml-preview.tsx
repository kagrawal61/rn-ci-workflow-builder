"use client";

import { motion } from "framer-motion";
import { Copy, FileJson } from "lucide-react";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism, atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface YamlPreviewProps {
  yamlContent: string;
  fileName?: string;
}

export function YamlPreview({ yamlContent, fileName = "workflow.yml" }: YamlPreviewProps) {
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
      console.error("Invalid YAML:", error);
      return yamlContent; // Return original if there's a parsing error
    }
  })();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedYaml).then(
      () => {
        setCopied(true);
        toast.success("YAML copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy YAML");
      }
    );
  };

  // Download YAML file
  const downloadYaml = () => {
    const blob = new Blob([formattedYaml], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${fileName}`);
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
            <Copy className={`h-4 w-4 ${copied ? "text-green-500" : ""}`} />
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
      <div className="max-h-[500px] overflow-auto p-0 border rounded-b-lg" style={{ backgroundColor: theme === "dark" ? "#1e1e2e" : "#ffffff" }}>
        {/* @ts-ignore - TypeScript has an issue with SyntaxHighlighter component */}
        <SyntaxHighlighter
          language="yaml"
          style={theme === "dark" ? atomDark : prism}
          customStyle={{
            margin: 0,
            borderRadius: "0 0 0.5rem 0.5rem",
            fontSize: "14px",
            lineHeight: "1.5",
            padding: "16px",
            background: theme === "dark" ? "#1e1e2e" : "#ffffff",
            color: theme === "dark" ? "#f8f8f2" : "#333333",
          }}
          wrapLongLines
          wrapLines
          showLineNumbers
          lineNumberStyle={{
            minWidth: "40px",
            textAlign: "right",
            opacity: 0.6,
            paddingRight: "12px",
            marginRight: "12px",
            borderRight: theme === "dark" ? "1px solid #2e2e3e" : "1px solid #d0d0d0",
          }}
          codeTagProps={{
            style: {
              display: "block",
              background: "none",
            },
          }}
        >
          {formattedYaml}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}