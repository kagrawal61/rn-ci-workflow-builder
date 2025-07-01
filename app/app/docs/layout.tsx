"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { cn } from "@/utils/cn";

interface DocsSidebarNavProps {
  items: {
    title: string;
    href: string;
  }[];
}

function DocsSidebarNav({ items }: DocsSidebarNavProps) {
  const pathname = usePathname();
  
  return (
    <nav className="flex flex-col space-y-1">
      {items.map((item) => {
        const isActive = 
          (pathname === item.href) || 
          (item.href !== "/docs" && pathname?.startsWith(item.href));
          
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium px-3 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary" 
                : "hover:text-primary hover:bg-accent"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  const sidebarNavItems = [
    {
      title: "Overview",
      href: "/docs",
    },
    {
      title: "Getting Started",
      href: "/docs/getting-started",
    },
    {
      title: "Core Concepts",
      href: "/docs/core-concepts",
    },
    {
      title: "Workflow Presets",
      href: "/docs/workflow-presets",
    },
    {
      title: "Configuration Reference",
      href: "/docs/configuration",
    },
    {
      title: "Storage Options",
      href: "/docs/storage-options",
    },
    {
      title: "Secrets Management",
      href: "/docs/secrets-management",
    },
  ];

  return (
    <>
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block border-r">
          <div className="h-full py-6 pr-2 pl-8 overflow-y-auto">
            <DocsSidebarNav items={sidebarNavItems} />
          </div>
        </aside>
        <main className="relative py-6 md:py-8 lg:py-10">
          {children}
        </main>
      </div>
    </>
  );
}