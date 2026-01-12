import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains'

const chains = [mainnet, polygon, arbitrum, optimism, base, sepolia] as const

// Wagmi config for Dynamic SDK integration
// Dynamic SDK handles wallet connections through DynamicWagmiConnector
// multiInjectedProviderDiscovery: false prevents conflicts with Dynamic's provider discovery
export const config = createConfig({
  chains,
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})
