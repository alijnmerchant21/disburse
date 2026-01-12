import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const chains = [mainnet, polygon, arbitrum, optimism, base, sepolia] as const

// Wagmi config for Dynamic SDK integration
// Dynamic SDK handles wallet connections, but we need minimal connectors for wagmi v2
export const config = createConfig({
  chains,
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}