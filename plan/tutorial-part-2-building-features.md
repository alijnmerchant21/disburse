# Part 2: Building features with Dynamic SDK

This is Part 2 of the Disburse tutorial. In this part, you learn how to use Dynamic SDK hooks, access wallet data, and build your dashboard components.

**Prerequisites**: Complete [Part 1: Getting started](./tutorial-part-1-getting-started.md) before continuing.

## Table of contents

1. [Use Dynamic SDK in components](#use-dynamic-sdk-in-components)
2. [Access wallet data](#access-wallet-data)
3. [Frontend implementation](#frontend-implementation)
4. [Next: Part 3](#next-part-3)

---

## Use Dynamic SDK in components

**File: `app/page.tsx`**

Use Dynamic SDK hooks to access wallet data:

```typescript
'use client'

import dynamic from 'next/dynamic'
import { Dashboard } from '@/components/Dashboard'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

const DynamicWidget = dynamic(
  () =>
    import('@dynamic-labs/sdk-react-core').then((mod) => mod.DynamicWidget),
  { ssr: false }
)

export default function Home() {
  const { user } = useDynamicContext()
  const isAuthenticated = !!user

  return (
    <main>
      <DynamicWidget />
      {isAuthenticated ? <Dashboard /> : <WelcomeScreen />}
    </main>
  )
}
```

**Key hooks from Dynamic SDK:**

1. **`useDynamicContext()`**
   - Returns: `{ user, primaryWallet, setShowAuthFlow, ... }`
   - `user`: Current authenticated user object (null if not logged in)
   - `primaryWallet`: The user's primary wallet
   - Use this to check authentication status

2. **`useUserWallets()`**
   - Returns: Array of all connected wallets
   - Each wallet has: `address`, `connector`, `chain`, etc.
   - Use this to display multiple wallets

**DynamicWidget component:**

- Pre-built UI component from Dynamic SDK
- Handles login/logout UI
- Shows connected wallet info
- Manages wallet connection flow
- Must be dynamically imported with `ssr: false`

---

## Access wallet data

**File: `components/Dashboard.tsx`**

Access wallet data using Dynamic SDK hooks:

```typescript
import { useDynamicContext, useUserWallets } from '@dynamic-labs/sdk-react-core'

export function Dashboard() {
  const { user, primaryWallet } = useDynamicContext()
  const userWallets = useUserWallets()
  
  // userWallets is an array of wallet objects
  const wallets = userWallets.map((w) => ({
    address: w.address || '',
    chainId: w.chain || 11155111, // Default to Sepolia
    connector: w.connector,
    walletName: w.connector?.name || 'Wallet',
  }))

  return (
    <div>
      {wallets.map(wallet => (
        <WalletTile key={wallet.address} wallet={wallet} />
      ))}
    </div>
  )
}
```

**Use Wagmi with Dynamic wallets:**

```typescript
import { useBalance } from 'wagmi'

function WalletTile({ wallet }: { wallet: Wallet }) {
  // This works because DynamicWagmiConnector syncs Dynamic wallets to Wagmi
  const { data: balance } = useBalance({
    address: wallet.address as `0x${string}`,
    chainId: wallet.chainId,
  })

  return <div>Balance: {balance?.formatted}</div>
}
```

**How this works:**

1. User connects wallet via DynamicWidget
2. Dynamic SDK stores wallet connection
3. `DynamicWagmiConnector` syncs wallet to Wagmi
4. Wagmi hooks (`useBalance`, `useAccount`, etc.) can now access the wallet
5. React Query caches the balance data

---

## Frontend implementation

### Component structure

```
app/
├── layout.tsx          # Root layout with Providers
├── page.tsx            # Home page with DynamicWidget
└── globals.css         # Global styles

components/
├── Providers.tsx       # Dynamic SDK + Wagmi setup
├── Dashboard.tsx       # Main dashboard component
├── BalanceSummary.tsx  # Aggregated balance display
└── WalletTile.tsx      # Individual wallet card
```

### Styling

- **Tailwind CSS** for utility-first styling
- Dark mode support via `dark:` classes
- Responsive design with `md:`, `lg:` breakpoints
- Custom animations and transitions

### Frontend patterns

1. **Conditional rendering**: Show Dashboard only when authenticated
2. **Loading states**: Display spinners while fetching data
3. **Error handling**: Graceful fallbacks for missing data
4. **Responsive layout**: Grid system adapts to screen size

---

## Next: Part 3

Continue to [Part 3: Advanced topics and enhancements](./tutorial-part-3-advanced-topics.md) to learn about data flow, troubleshooting, and bonus enhancement features you can add to your dashboard.
