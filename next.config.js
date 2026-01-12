/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable output file tracing to prevent stack overflow during build trace collection
  // This is a temporary workaround for Next.js 14.0.4 build trace collection issues
  outputFileTracing: false,
  webpack: (config, { webpack, isServer }) => {
    // Use IgnorePlugin to completely ignore React Native dependencies from MetaMask SDK
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^@react-native-async-storage\/async-storage$/,
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^react-native$/,
      })
    )

    // Fallback for optional dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    }

    return config
  },
}

module.exports = nextConfig
