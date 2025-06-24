/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // When building the app, the build system needs to know where to find the local package
  // If this is deployed, we'd use a proper npm package instead
  transpilePackages: ['../src'],
};

export default nextConfig;