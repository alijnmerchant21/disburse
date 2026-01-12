/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
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
