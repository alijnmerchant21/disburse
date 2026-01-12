'use client'

import { useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { formatBalance, formatCurrency } from '@/lib/balance'
import { useState } from 'react'

interface Wallet {
  address: string
  chainId?: number
  connector?: any
  walletClient?: any
}

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  11155111: 'Sepolia',
  137: 'Polygon',
  42161: 'Arbitrum',
  10: 'Optimism',
  8453: 'Base',
}

const CHAIN_COLORS: Record<number, string> = {
  1: 'bg-blue-500',
  11155111: 'bg-gray-500',
  137: 'bg-purple-500',
  42161: 'bg-cyan-500',
  10: 'bg-red-500',
  8453: 'bg-blue-400',
}

type SupportedChainId = 1 | 10 | 137 | 42161 | 8453 | 11155111

const SUPPORTED_CHAINS: SupportedChainId[] = [11155111, 1, 137, 42161, 10, 8453] // Sepolia first as default

export function WalletTile({ wallet }: { wallet: Wallet }) {
  const [selectedChain, setSelectedChain] = useState<SupportedChainId>(
    (wallet.chainId as SupportedChainId) || 11155111, // Default to Sepolia testnet
  )

  const { data: balance, isLoading } = useBalance({
    address: wallet.address as `0x${string}`,
    chainId: selectedChain,
  })

  const balanceNum = balance ? parseFloat(formatEther(balance.value)) : 0
  const estimatedUSD = balanceNum * 2500 // Simplified USD conversion

  const shortAddress = `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`

  // Supported chains for this wallet
  const supportedChains = SUPPORTED_CHAINS

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 card-hover fade-in">
      {/* Wallet Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
              {wallet.connector?.name || 'Wallet'}
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded inline-block">
            {shortAddress}
          </p>
        </div>
        <div
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm ${CHAIN_COLORS[selectedChain] || 'bg-slate-500'}`}
        >
          {CHAIN_NAMES[selectedChain] || `Chain ${selectedChain}`}
        </div>
      </div>

      {/* Balance Display */}
      <div className="mb-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-2/3"></div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {formatBalance(balance?.value || BigInt(0))}
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                ETH
              </span>
            </div>
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">
              ≈ {formatCurrency(estimatedUSD)}
            </p>
          </div>
        )}
      </div>

      {/* Chain Selector */}
      {supportedChains.length > 1 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            View balance on:
          </p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_CHAINS.map((chainId: SupportedChainId) => (
              <button
                key={chainId}
                onClick={() => setSelectedChain(chainId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedChain === chainId
                    ? 'bg-blue-500 text-white shadow-sm scale-105'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 hover:scale-105'
                }`}
              >
                {CHAIN_NAMES[chainId]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tooltip Info */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This wallet's balance on{' '}
            {CHAIN_NAMES[selectedChain] || 'the selected chain'}. Switch chains
            to see balances on other networks.
          </p>
        </div>
      </div>
    </div>
  )
}