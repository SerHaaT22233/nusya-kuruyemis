/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/nusya-kuruyemis',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '/images**',
      },
    ],
  },
}

module.exports = nextConfig