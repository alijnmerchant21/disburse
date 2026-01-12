import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains'

const chains = [mainnet, polygon, arbitrum, optimism, base, sepolia] as const

// Wagmi config for Dynamic SDK integration
// Dynamic SDK handles wallet connections through DynamicWagmiConnector
export const config = createConfig({
  chains,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: false,
})
