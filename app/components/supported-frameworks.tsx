"use client"

import { motion } from "framer-motion";
import { Smartphone, Layers } from "lucide-react";
import { Button } from "./ui/button";

export function SupportedFrameworks() {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight">Supported Frameworks</h2>
          <p className="mt-3 text-xl text-muted-foreground max-w-2xl mx-auto">
            Build and deploy your mobile applications with our specialized CI/CD workflows
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* React Native Card */}
          <motion.div
            className="rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">React Native</h3>
                    <span className="ml-3 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Available
                    </span>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Generate optimized CI/CD workflows for React Native iOS and Android apps with GitHub Actions
                  </p>
                  <div className="mt-4">
                    <Button 
                      onClick={() => {
                        document.getElementById('workflow-builder')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      size="sm"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Expo Card */}
          <motion.div
            className="rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Expo</h3>
                    <span className="ml-3 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Seamless CI/CD workflows for Expo projects with EAS Build integration and preview deployments
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" disabled>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}