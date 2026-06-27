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
}

module.exports = nextConfig
