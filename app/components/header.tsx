'use client';

import { PROJECT_NAME } from "@/config/constants";
import { BookText, Star } from "lucide-react";
import Link from "next/link";
import { IssueReportDialog } from "./issue-report-dialog";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center">
            <span className="font-bold">
              {PROJECT_NAME.replace('React Native', 'RN')}
            </span>
          </Link>
          <nav className="hidden items-center space-x-4 md:flex">
            <Link
              href="/docs"
              className="text-sm font-medium hover:text-primary"
            >
              Documentation
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <IssueReportDialog />
            <Link href="/docs" className="md:hidden">
              <div className="h-8 w-8 rounded-md border border-input bg-background p-1 hover:bg-accent hover:text-accent-foreground">
                <BookText className="h-full w-full" />
                <span className="sr-only">Documentation</span>
              </div>
            </Link>
            <a
              href="https://github.com/kagrawal61/rn-ci-workflow-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Star className="h-4 w-4" />
                <span>Star us on GitHub</span>
              </Button>
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
