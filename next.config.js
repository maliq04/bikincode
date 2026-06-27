/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable network access for development
  async rewrites() {
    return []
  },
  // Configure hostname and port
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig