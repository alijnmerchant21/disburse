'use client'

import { useDynamicContext, useUserWallets } from '@dynamic-labs/sdk-react-core'
import { useEffect, useState } from 'react'
import { WalletTile } from './WalletTile'
import { BalanceSummary } from './BalanceSummary'

export function Dashboard() {
  const { user, primaryWallet } = useDynamicContext()
  const userWallets = useUserWallets()
  
  // Convert userWallets to a format we can use
  // userWallets returns an array of wallet objects with address, connector, etc.
  const validChainIds = [1, 10, 137, 42161, 8453, 11155111] as const
  type ValidChainId = typeof validChainIds[number]
  
  const wallets = userWallets.map((w) => {
    // Safely convert chain ID - default to Sepolia testnet (11155111) if not a valid chain
    const rawChain = (w as any).chain
    const chainId: ValidChainId = 
      typeof rawChain === 'number' && validChainIds.includes(rawChain as ValidChainId)
        ? (rawChain as ValidChainId)
        : 11155111
    
    return {
      address: w.address || '',
      chainId,
      connector: w.connector,
      walletName: w.connector?.name || 'Wallet',
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      setIsLoading(true)
      // Fetch balances will be handled by individual wallet components
      setTimeout(() => setIsLoading(false), 1000)
    } else {
      setIsLoading(false)
    }
  }, [wallets])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading your wallet balances...
          </p>
        </div>
      </div>
    )
  }

  if (!wallets || wallets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            No wallets connected
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Connect a wallet using the Dynamic widget above to view your
            balances.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Balance Summary */}
      <BalanceSummary wallets={wallets} />

      {/* Wallet Tiles */}
      <div className="fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Your Wallets
          </h2>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {wallets.length} {wallets.length === 1 ? 'wallet' : 'wallets'} connected
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet, index) => (
            <WalletTile key={wallet.address || index} wallet={wallet} />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm fade-in">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 text-blue-600 dark:text-blue-400 mt-0.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center p-1.5">
            <svg fill="currentColor" viewBox="0 0 20 20" className="w-5 h-5">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-lg">
              About Your Balances
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              Your balances are aggregated from all connected wallets across
              different blockchains. Each wallet tile shows balances per chain.
              Total values are converted to USD for easy comparison. Switch between
              chains using the buttons on each wallet card to see balances on different networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}