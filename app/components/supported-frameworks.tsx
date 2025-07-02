'use client';

import { motion } from 'framer-motion';
import { BarChart3, CircleDashed, Cpu, GitBranch, Layers, RefreshCw, Server, Smartphone, TestTube, Workflow } from 'lucide-react';
import { Button } from './ui/button';

export function SupportedFrameworks() {
  return (
    <section className="bg-muted/20 py-16">
      <div className="container">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight">
            Supported Frameworks
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-muted-foreground">
            Build and deploy your mobile applications with our specialized CI/CD
            workflows
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl space-y-12">
          <div className="rounded-xl bg-card/50 border border-border/40 p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-foreground/90 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3 dark:bg-green-900/30 dark:text-green-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 7 17l-5-5" /></svg>
              </span>
              Available Now
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          
          {/* React Native Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
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
                    Configure and generate optimized CI/CD workflows for React Native iOS and
                    Android apps using our tailored GitHub Actions templates
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        document
                          .getElementById('workflow-builder')
                          ?.scrollIntoView({ behavior: 'smooth' });
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

          {/* CI/CD Tools Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <GitBranch className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">CI/CD Tools</h3>
                    <span className="ml-3 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Available
                    </span>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Preconfigured GitHub Actions and Bitrise integration with automated code signing, cache management, and simplified deployment pipelines
                  </p>
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        document
                          .getElementById('workflow-builder')
                          ?.scrollIntoView({ behavior: 'smooth' });
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

            </div>
          </div>
          
          <div className="rounded-xl bg-card/50 border border-border/40 p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-foreground/90 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 mr-3 dark:bg-indigo-900/30 dark:text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </span>
              Workflow Features <span className="ml-2 text-sm font-normal text-muted-foreground">(Coming Soon)</span>
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

          {/* Maestro Testing Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <TestTube className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Maestro Testing</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Integrate Maestro UI testing with declarative test flows, visual test results, and automated screenshot verification for mobile apps
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-blue-600 dark:text-blue-400 border border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CodePush/OTA Updates Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <RefreshCw className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">OTA Updates</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Deploy JavaScript updates directly to users with Microsoft's CodePush and Expo Updates, bypassing app store reviews with automatic rollback capabilities
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-teal-600 dark:text-teal-400 border border-teal-500 hover:bg-teal-50 dark:hover:bg-teal-950/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-teal-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-teal-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-teal-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-teal-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bundle Analysis Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-violet-400 to-violet-600 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <BarChart3 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Bundle Analysis</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Track JavaScript bundle sizes, identify large dependencies, and monitor performance metrics with automated reports in your CI pipeline
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-violet-600 dark:text-violet-400 border border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-violet-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

            </div>
          </div>
          
          <div className="rounded-xl bg-card/50 border border-border/40 p-8 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-foreground/90 flex items-center">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 mr-3 dark:bg-amber-900/30 dark:text-amber-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
              </span>
              On the Roadmap
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

          {/* Expo Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Expo</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Specialized CI/CD workflows for Expo projects leveraging EAS Build, managed credentials, and QR code preview deployments for easy testing
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-purple-600 dark:text-purple-400 border border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Native iOS Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-gray-500 to-gray-700 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800/30">
                    <Server className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Native iOS</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Native iOS CI/CD pipeline with Xcode Cloud integration, TestFlight distribution, and automated App Store Connect publishing workflows
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-gray-600 dark:text-gray-400 border border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-gray-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-gray-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-gray-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-gray-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Native Android Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-green-600 to-green-400 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Cpu className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Native Android</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Dedicated Android pipelines supporting Kotlin and Java with optimized Gradle caching, Google Play internal testing, and phased rollout deployments
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-green-600 dark:text-green-400 border border-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-green-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Fastlane Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Workflow className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">Fastlane Integration</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Integrate Fastlane for certificate management, and customizable deployment lanes with minimal configuration
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-amber-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-amber-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CircleCI Card */}
          <motion.div
            className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-1"></div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="mr-4 flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CircleDashed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">CircleCI Integration</h3>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Pre-configured workflows featuring parallel test execution, dependency caching, and Docker-based environment management
                  </p>
                  <div className="mt-4">
                    <Button 
                      className="bg-transparent text-blue-600 dark:text-blue-400 border border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 shadow-sm relative overflow-hidden cursor-pointer" 
                      size="sm" 
                      onClick={() => {}}
                    >
                      <span className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px left-0 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      <span className="absolute inset-y-0 w-px right-0 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-shimmer"></span>
                      Stay Tuned
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}