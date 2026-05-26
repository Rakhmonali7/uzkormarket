/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'pub-*.r2.dev' },
      { protocol: 'https', hostname: '*.supabase.co' },
      // MinIO / production object storage
      { protocol: 'http',  hostname: 'localhost', port: '9000' },
      { protocol: 'https', hostname: '*.koruz.example.com' },
      { protocol: 'https', hostname: 'objects.koruz.example.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Proxy /api/v1/* to the backend during development.
  // In production, set NEXT_PUBLIC_API_URL to the absolute backend URL instead.
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    return [
      {
        source:      '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ]
  },

  output: 'standalone',

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
