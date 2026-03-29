'use client';

import { PROJECT_NAME } from '@/config/constants';
import { Github, HeartHandshake, TwitterIcon } from 'lucide-react';
import Link from 'next/link';

const navLinks = {
  Product: [
    { label: 'Home', href: '/' },
    { label: 'Workflow Builder', href: '/#workflow-builder' },
    { label: 'Benefits', href: '/docs/benefits' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'Getting Started', href: '/docs/getting-started' },
    { label: 'Core Concepts', href: '/docs/core-concepts' },
    { label: 'Secrets Management', href: '/docs/secrets-management' },
  ],
};

export function FooterSection() {
  return (
    <footer className="mt-16 w-full border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">{PROJECT_NAME}</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Generate production-ready CI/CD workflows for React Native
              projects — free, open-source, and no sign-up required.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <a
                href="https://github.com/kagrawal61/rn-ci-workflow-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                aria-label="GitHub repository"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/KushalAgrawal14"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                aria-label="Kushal on Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
                <span>@KushalAgrawal14</span>
              </a>
              <a
                href="https://twitter.com/NikhilVDev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                aria-label="Nikhil on Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
                <span>@NikhilVDev</span>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(navLinks).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-3">
              <p className="text-sm font-semibold">{group}</p>
              <ul className="flex flex-col gap-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {PROJECT_NAME}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <HeartHandshake className="h-4 w-4 text-red-500" />
            <span>for the React Native community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
