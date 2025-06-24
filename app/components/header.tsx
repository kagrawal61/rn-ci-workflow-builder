"use client";

import { IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { PROJECT_NAME, REPO_URL } from "@/config/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center">
            <span className="font-bold">{PROJECT_NAME.replace("React Native", "RN")}</span>
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
            >
              <div className="h-8 w-8 rounded-md border border-input bg-background p-1 hover:bg-accent hover:text-accent-foreground">
                <IconBrandGithub className="h-full w-full" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}