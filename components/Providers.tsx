'use client'

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )

  const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID || ''

  useEffect(() => {
    if (!environmentId) {
      console.error(
        '⚠️ NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID is missing! Please add it to your .env.local file.',
      )
    }
  }, [environmentId])

  if (!environmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Configuration Error
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            Dynamic Environment ID is missing. Please add{' '}
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID
            </code>{' '}
            to your environment variables.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create a <code>.env.local</code> file in the root directory with your
            Dynamic environment ID.
          </p>
        </div>
      </div>
    )
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [EthereumWalletConnectors],
        appName: 'Disburse',
        appLogoUrl: '/logo.png',
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  )
}