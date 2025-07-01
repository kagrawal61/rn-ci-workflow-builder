/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // When building the app, the build system needs to know where to find the local package
  // If this is deployed, we'd use a proper npm package instead
  transpilePackages: ['../src'],
  
  // Configuration for GitHub Pages
  output: 'export',
  // Disable image optimization since it's not supported with 'export'
  images: { unoptimized: true },
  // Set the base path if deploying to a GitHub Pages project page
  // basePath: '/rn-ci-workflow-builder',
  eslint: {
    ignoreDuringBuilds: true,   // ⛔️ Disables ESLint for production builds
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
};

export default nextConfig;