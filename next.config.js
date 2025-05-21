/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useCache: true,
  },
  devIndicators: {
    position: 'bottom-right',
  },
}

module.exports = nextConfig
