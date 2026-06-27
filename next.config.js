/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return []
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  // Exclude API routes from static generation
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  // Skip pre-rendering for API routes that require DB
  outputFileTracingExcludes: {
    '*': ['./prisma/dev.db'],
  },
}

module.exports = nextConfig
