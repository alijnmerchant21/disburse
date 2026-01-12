import { formatEther } from 'viem'
import { Chain } from 'wagmi/chains'

export interface WalletBalance {
  chainId: number
  chainName: string
  address: string
  balance: string // in ETH/wei
  balanceFormatted: string
  balanceUSD: number
}

export interface WalletData {
  walletName: string
  address: string
  balances: WalletBalance[]
  totalBalanceUSD: number
}

export interface AggregatedData {
  wallets: WalletData[]
  totalBalanceUSD: number
  currency: 'native' | 'usd'
}

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  11155111: 'Sepolia',
  137: 'Polygon',
  42161: 'Arbitrum',
  10: 'Optimism',
  8453: 'Base',
}

// Simple token price fetching (in production, use CoinGecko API or similar)
const getTokenPrice = async (chainId: number): Promise<number> => {
  // For demo purposes, return a static price
  // In production, fetch from CoinGecko: https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,arbitrum,optimism,base-ethereum&vs_currencies=usd',
    )
    const data = await response.json()
    
    const priceMap: Record<number, number> = {
      1: data.ethereum?.usd || 2500,
      11155111: data.ethereum?.usd || 2500,
      137: data['matic-network']?.usd || 0.8,
      42161: data.ethereum?.usd || 2500,
      10: data.ethereum?.usd || 2500,
      8453: data['base-ethereum']?.usd || data.ethereum?.usd || 2500,
    }
    
    return priceMap[chainId] || 2500
  } catch (error) {
    console.error('Error fetching token price:', error)
    // Fallback prices
    const fallbackPrices: Record<number, number> = {
      1: 2500,
      11155111: 2500,
      137: 0.8,
      42161: 2500,
      10: 2500,
      8453: 2500,
    }
    return fallbackPrices[chainId] || 2500
  }
}

export const formatBalance = (balance: bigint, decimals: number = 18): string => {
  const formatted = formatEther(balance)
  const num = parseFloat(formatted)
  if (num === 0) return '0.00'
  if (num < 0.0001) return '< 0.0001'
  if (num < 1) return num.toFixed(6)
  if (num < 1000) return num.toFixed(4)
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const calculateBalances = async (
  wallets: Array<{ address: string; chainId: number }>,
  getBalance: (address: string, chainId: number) => Promise<bigint>,
): Promise<AggregatedData> => {
  const walletDataMap = new Map<string, WalletData>()

  // Group wallets by address
  for (const wallet of wallets) {
    if (!walletDataMap.has(wallet.address)) {
      walletDataMap.set(wallet.address, {
        walletName: `Wallet ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`,
        address: wallet.address,
        balances: [],
        totalBalanceUSD: 0,
      })
    }
  }

  // Fetch balances for each wallet/chain combination
  const balancePromises = wallets.map(async (wallet) => {
    try {
      const balance = await getBalance(wallet.address, wallet.chainId)
      const price = await getTokenPrice(wallet.chainId)
      const balanceFormatted = formatBalance(balance)
      const balanceNum = parseFloat(formatEther(balance))
      const balanceUSD = balanceNum * price

      const walletData = walletDataMap.get(wallet.address)!
      walletData.balances.push({
        chainId: wallet.chainId,
        chainName: CHAIN_NAMES[wallet.chainId] || `Chain ${wallet.chainId}`,
        address: wallet.address,
        balance: balance.toString(),
        balanceFormatted,
        balanceUSD,
      })
      walletData.totalBalanceUSD += balanceUSD
    } catch (error) {
      console.error(`Error fetching balance for ${wallet.address} on chain ${wallet.chainId}:`, error)
    }
  })

  await Promise.all(balancePromises)

  const walletDataArray = Array.from(walletDataMap.values())
  const totalBalanceUSD = walletDataArray.reduce((sum, wallet) => sum + wallet.totalBalanceUSD, 0)

  return {
    wallets: walletDataArray,
    totalBalanceUSD,
    currency: 'usd',
  }
}