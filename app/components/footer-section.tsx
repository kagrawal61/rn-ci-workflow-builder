"use client"

import { Github, HeartHandshake } from "lucide-react";
import { PROJECT_NAME, REPO_URL } from "@/config/constants";

export function FooterSection() {
  return (
    <footer className="mt-16 border-t bg-muted/40 py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} {PROJECT_NAME}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a 
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <HeartHandshake className="h-4 w-4 text-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}