# Part 1: Getting started with Dynamic SDK

This tutorial shows you how to build **Disburse**, a multi-wallet balance dashboard that aggregates crypto holdings across multiple wallets and chains into a unified view. This is Part 1 of a 3-part series that focuses on integrating **Dynamic SDK** to handle wallet authentication, connection, and management.

## Table of contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Set up Dynamic SDK](#set-up-dynamic-sdk)
4. [Configure Wagmi](#configure-wagmi)
5. [Set up providers](#set-up-providers)
6. [Next: Part 2](#next-part-2)

---

## Overview

**Disburse** aggregates crypto holdings across multiple wallets and chains into a unified view. This tutorial focuses on integrating **Dynamic SDK** to handle wallet authentication, connection, and management.

### Technologies

- **Next.js 14** (App Router) - React framework
- **Dynamic SDK** - Wallet authentication and management
- **Wagmi v2 + Viem** - Blockchain interactions
- **TanStack Query** - Data fetching and caching
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  app/layout.tsx                                               │
│  └── Providers (dynamic import, ssr: false)                  │
│      └── DynamicContextProvider                              │
│          └── WagmiProvider                                    │
│              └── QueryClientProvider                          │
│                  └── DynamicWagmiConnector                    │
│                      └── app/page.tsx                         │
│                          ├── DynamicWidget                    │
│                          └── Dashboard (when authenticated)   │
│                              ├── BalanceSummary               │
│                              └── WalletTile[]                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

The app follows a provider pattern:

1. **Providers** wrap the entire app with necessary contexts
2. **Dynamic SDK** handles all wallet operations
3. **Wagmi** provides blockchain interaction capabilities
4. **Components** consume wallet data via Dynamic SDK hooks

---

## Set up Dynamic SDK

### Install packages

Install the required packages:

```bash
npm install @dynamic-labs/sdk-react-core @dynamic-labs/ethereum @dynamic-labs/wagmi-connector
npm install wagmi viem @tanstack/react-query
```

### Configure environment variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_environment_id_here
```

To get your Environment ID:

1. Sign up at [Dynamic Dashboard](https://app.dynamic.xyz)
2. Create a new project
3. Copy your Environment ID from the project settings
4. Paste it in `.env.local`

---

## Configure Wagmi

**File: `lib/wagmi.ts`**

Configure Wagmi to work with Dynamic SDK:

```typescript
import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base, sepolia } from 'wagmi/chains'

const chains = [mainnet, polygon, arbitrum, optimism, base, sepolia] as const

export const config = createConfig({
  chains,
  multiInjectedProviderDiscovery: false, // Critical: Prevents conflicts with Dynamic
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})
```

**Important configuration details:**

- **`multiInjectedProviderDiscovery: false`**: Required when using Dynamic SDK. Dynamic handles provider discovery internally, so you disable Wagmi's discovery to prevent conflicts.
- **No connectors defined**: Dynamic SDK manages wallet connectors through `DynamicWagmiConnector`, so you don't define connectors here.
- **Chain configuration**: Define all chains you want to support. Users can switch between these chains.

---

## Set up providers

**File: `components/Providers.tsx`**

This is the core of the Dynamic SDK integration. Create the Providers component:

```typescript
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
```

#### Understanding the code

**Why `'use client'`?**

- Dynamic SDK uses browser APIs (window, localStorage, etc.)
- These APIs are not available during Server-Side Rendering (SSR)
- Marking the component as client-side ensures it only runs in the browser

**QueryClient setup:**

- Use `useState` with a function initializer to create QueryClient once
- This prevents creating a new QueryClient on every render
- Configure it to minimize unnecessary refetches

**Environment ID validation:**

- Validates that the environment ID exists
- Shows a helpful error message if missing
- Prevents the SDK from initializing with invalid configuration

**Provider stack:**

```typescript
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
```

#### Provider order (critical)

1. **`DynamicContextProvider`** (outermost)
   - Initializes Dynamic SDK
   - Manages user authentication state
   - Handles wallet connection logic
   - Provides `useDynamicContext()` hook
   - Settings:
     - `environmentId`: Your Dynamic project ID
     - `walletConnectors`: Which wallet types to support (Ethereum in this case)
     - `appName`: Display name for your app

2. **`WagmiProvider`**
   - Provides Wagmi configuration to all child components
   - Enables `useBalance()`, `useAccount()`, and other hooks
   - Must be inside DynamicContextProvider

3. **`QueryClientProvider`**
   - Provides React Query for data fetching and caching
   - Used by Wagmi for caching blockchain queries
   - Must be inside WagmiProvider

4. **`DynamicWagmiConnector`** (innermost)
   - Bridges Dynamic SDK and Wagmi
   - Syncs Dynamic's wallet connections with Wagmi's state
   - Makes Dynamic-connected wallets available to Wagmi hooks
   - Wraps your app content

#### Why this order matters

- Dynamic SDK must initialize first
- Wagmi needs Dynamic's wallet state
- QueryClient is used by Wagmi
- DynamicWagmiConnector syncs Dynamic → Wagmi state

### Integrate with root layout

**File: `app/layout.tsx`**

Wrap your app with the Providers component:

```typescript
import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'

const Providers = dynamic(
  () => import('@/components/Providers').then(mod => ({ default: mod.Providers })),
  { ssr: false }
)

export const metadata: Metadata = {
  title: 'Disburse - Multi-Wallet Balance Dashboard',
  description: 'Connect and consolidate your crypto wallets across multiple chains into a single, easy-to-understand view.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

#### Why use dynamic import?

- Dynamic SDK cannot run during SSR
- `dynamic()` with `ssr: false` ensures Providers only load on the client
- Prevents "window is not defined" errors during build
- Allows the rest of the page to be server-rendered (better SEO and performance)

---

## Next: Part 2

Continue to [Part 2: Building features with Dynamic SDK](./tutorial-part-2-building-features.md) to learn how to use Dynamic SDK hooks, access wallet data, and build your dashboard components.
