/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ignore pino-pretty warning (it's an optional dev dependency used by WalletConnect)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    }
    return config
  },
}

module.exports = nextConfig