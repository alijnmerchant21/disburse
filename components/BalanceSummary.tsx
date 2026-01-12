'use client'

import { useBalance, usePublicClient } from 'wagmi'
import { useState, useEffect, useMemo } from 'react'
import { formatEther } from 'viem'
import { formatCurrency } from '@/lib/balance'

interface Wallet {
  address: string
  chainId?: number
  connector?: any
}

type SupportedChainId = 1 | 10 | 137 | 42161 | 8453 | 11155111

// Component to fetch balance for a single wallet
function WalletBalanceFetcher({
  address,
  chainId,
  onBalanceUpdate,
}: {
  address: string
  chainId: SupportedChainId
  onBalanceUpdate: (balance: number) => void
}) {
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
    chainId,
    query: {
      enabled: !!address,
    },
  })

  useEffect(() => {
    if (balance) {
      const balanceNum = parseFloat(formatEther(balance.value))
      // Estimate USD value (ETH price ~$2500 for Sepolia/mainnet)
      const estimatedUSD = balanceNum * 2500
      onBalanceUpdate(estimatedUSD)
    } else {
      onBalanceUpdate(0)
    }
  }, [balance, onBalanceUpdate])

  return null
}

export function BalanceSummary({ wallets }: { wallets: Wallet[] }) {
  const [walletBalances, setWalletBalances] = useState<Map<string, number>>(
    new Map(),
  )
  const [isLoading, setIsLoading] = useState(true)

  // Update balance for a specific wallet
  const handleBalanceUpdate = (walletAddress: string) => (balance: number) => {
    setWalletBalances((prev) => {
      const newMap = new Map(prev)
      newMap.set(walletAddress, balance)
      return newMap
    })
  }

  // Calculate total balance from all wallets
  const totalBalance = useMemo(() => {
    return Array.from(walletBalances.values()).reduce((sum, bal) => sum + bal, 0)
  }, [walletBalances])

  // Check if we have balances for all wallets
  useEffect(() => {
    if (wallets.length > 0 && walletBalances.size === wallets.length) {
      setIsLoading(false)
    } else if (wallets.length === 0) {
      setIsLoading(false)
    }
  }, [walletBalances, wallets.length])

  // Default chain ID (Sepolia testnet)
  const defaultChainId: SupportedChainId = 11155111

  return (
    <>
      {/* Fetch balances for all wallets */}
      {wallets.map((wallet) => (
        <WalletBalanceFetcher
          key={wallet.address}
          address={wallet.address}
          chainId={(wallet.chainId as SupportedChainId) || defaultChainId}
          onBalanceUpdate={handleBalanceUpdate(wallet.address)}
        />
      ))}

      {/* Display the summary */}
      {isLoading ? (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-xl">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-white/20 rounded mb-4"></div>
            <div className="h-12 w-48 bg-white/20 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl text-white fade-in card-hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <p className="text-blue-100 text-sm font-medium mb-3 opacity-90">
            Your Total Crypto Holdings
          </p>
          <h2 className="text-5xl font-bold mb-2 tracking-tight">
            {formatCurrency(totalBalance)}
          </h2>
          <p className="text-blue-100 text-sm opacity-75">
            Aggregated from {wallets.length} connected{' '}
            {wallets.length === 1 ? 'wallet' : 'wallets'}
          </p>
        </div>
        <div className="hidden md:block ml-6">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-lg border border-white/30">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
        </div>
      )}
    </>
  )
}