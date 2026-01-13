# Part 3: Advanced topics and enhancements

This is Part 3 of the Disburse tutorial. In this part, you learn about the complete data flow, troubleshooting common issues, and bonus enhancement features you can add to your dashboard.

**Prerequisites**: Complete [Part 1](./tutorial-part-1-getting-started.md) and [Part 2](./tutorial-part-2-building-features.md) before continuing.

## Table of contents

1. [Complete data flow](#complete-data-flow)
2. [Troubleshooting](#troubleshooting)
3. [Bonus enhancements](#bonus-enhancements)
4. [Next steps](#next-steps)

---

## Complete data flow

Here's how data flows through the application:

```
1. User opens app
   ↓
2. Providers component initializes
   ↓
3. DynamicContextProvider connects to Dynamic API
   ↓
4. User clicks "Login" on DynamicWidget
   ↓
5. Dynamic SDK opens wallet connection modal
   ↓
6. User connects wallet (e.g., MetaMask)
   ↓
7. Dynamic SDK stores wallet connection
   ↓
8. DynamicWagmiConnector syncs wallet to Wagmi
   ↓
9. useDynamicContext() returns user object
   ↓
10. useUserWallets() returns connected wallets array
    ↓
11. Dashboard component renders with wallets
    ↓
12. WalletTile components use useBalance() from Wagmi
    ↓
13. Wagmi queries blockchain via Viem
    ↓
14. Balance data cached by React Query
    ↓
15. UI updates with wallet balances
```

### Authentication flow

```
Not Authenticated
    ↓
User clicks DynamicWidget
    ↓
Dynamic SDK shows wallet options
    ↓
User selects wallet (MetaMask, WalletConnect, etc.)
    ↓
Wallet prompts user to connect
    ↓
User approves connection
    ↓
Dynamic SDK creates/updates user session
    ↓
Authenticated ✓
```

---

## Troubleshooting

### Common issues

#### "window is not defined" error

**Cause**: Dynamic SDK running during SSR

**Solution**: Use `dynamic()` import with `ssr: false`

#### Widget stuck loading

**Cause**: Missing or invalid Environment ID

**Solution**: Check `.env.local` and verify ID in Dynamic dashboard

#### "Maximum call stack size exceeded"

**Cause**: Missing `multiInjectedProviderDiscovery: false` in Wagmi config

**Solution**: Add this to your Wagmi config

#### Wallets not showing in Wagmi hooks

**Cause**: `DynamicWagmiConnector` not wrapping components

**Solution**: Ensure it's inside all providers and wraps your app

#### Build errors on Vercel

**Cause**: SSR issues or missing dependencies

**Solution**:

- Use dynamic imports for Dynamic components
- Add webpack config to ignore React Native dependencies
- Disable output file tracing if needed

### Debugging tips

1. **Check browser console**
   - Look for Dynamic SDK errors
   - Verify network requests to Dynamic API

2. **Verify environment variables**
   - Ensure `NEXT_PUBLIC_` prefix is used
   - Restart dev server after changes

3. **Test wallet connection**
   - Try different wallets (MetaMask, WalletConnect)
   - Check if wallet extension is installed/enabled

4. **Inspect provider order**
   - Ensure providers are nested correctly
   - DynamicContextProvider → WagmiProvider → QueryClientProvider → DynamicWagmiConnector

---

## Bonus enhancements

Once you have the basic dashboard working, you can enhance it with these features:

### Enhanced dashboard with advanced analytics

Add a more comprehensive dashboard with advanced analytics:

- **Portfolio overview**: Show total value, 24h change, and asset distribution
- **Performance metrics**: Display gains/losses, ROI, and historical trends
- **Asset allocation**: Pie charts showing distribution across chains and tokens
- **Quick actions**: Add buttons for common operations (swap, send, receive)

**Implementation tips:**

- Use charting libraries like `recharts` or `chart.js`
- Aggregate data from multiple sources
- Cache analytics data with React Query
- Add time range filters (1D, 7D, 30D, All)

### Transaction details and history

Add detailed transaction history and information:

- **Transaction list**: Show all transactions across connected wallets
- **Transaction details**: Display gas fees, timestamps, status, and block numbers
- **Filtering and search**: Filter by chain, wallet, transaction type, or date range
- **Export functionality**: Export transaction data as CSV or JSON

**Implementation tips:**

- Use `usePublicClient` from Wagmi to fetch transaction data
- Implement pagination for large transaction lists
- Cache transaction data with React Query
- Add loading states and error handling
- Use date libraries like `date-fns` for formatting

**Use cases:**

- **Businesses**: Track payments, invoices, and expenses across wallets
- **Freelancers**: Monitor income and expenses for tax purposes
- **Personal use**: Keep track of all crypto activity in one place

### Tax export and reporting

Add options to export tax details and transaction reports:

- **Tax reports**: Generate reports formatted for common tax software
- **Transaction exports**: Export data in formats compatible with tax tools
- **Cost basis tracking**: Calculate and track cost basis for assets
- **Realized gains/losses**: Show realized gains and losses for tax reporting

**Implementation tips:**

- Format data according to tax software requirements (TurboTax, CoinTracker, etc.)
- Calculate cost basis using FIFO, LIFO, or other methods
- Generate PDF reports using libraries like `jspdf`
- Add date range selection for tax years
- Include all necessary transaction details (date, amount, fees, etc.)

### Charts and visualizations

Add interactive charts and visualizations:

- **Balance charts**: Line charts showing balance over time
- **Asset distribution**: Pie charts showing portfolio allocation
- **Chain comparison**: Bar charts comparing balances across chains
- **Historical trends**: Show value changes over time periods

**Implementation tips:**

- Use charting libraries like `recharts`, `chart.js`, or `victory`
- Fetch historical price data from APIs like CoinGecko
- Store historical data in a database or cache
- Add interactive features (zoom, hover details, time range selection)
- Make charts responsive and accessible

### Additional enhancement ideas

- **Multi-token support**: Show ERC-20 token balances, not just native tokens
- **Price alerts**: Notify users when asset prices reach certain thresholds
- **Wallet management**: Add ability to rename wallets, set favorites, or organize wallets
- **Dark/light mode toggle**: Allow users to switch themes
- **Export wallet addresses**: Export all wallet addresses as CSV or QR codes
- **Transaction simulation**: Show estimated gas fees before executing transactions
- **Multi-language support**: Add internationalization (i18n)

---

## Next steps

Dynamic SDK provides a powerful abstraction for wallet management in Web3 applications. By handling authentication, wallet connections, and state management, it eliminates much of the complexity traditionally associated with building wallet-connected apps.

### Key takeaways

1. **Provider setup is critical**: The order and nesting of providers determines if your app works
2. **SSR handling**: Always use dynamic imports for Dynamic SDK components
3. **Wagmi integration**: `DynamicWagmiConnector` bridges Dynamic SDK and Wagmi seamlessly
4. **Environment configuration**: Always validate your Environment ID
5. **Hooks pattern**: Use `useDynamicContext()` and `useUserWallets()` to access wallet data

### Additional resources

- Explore Dynamic SDK's customization options
- Add support for additional chains
- Implement token balance fetching
- Customize the DynamicWidget appearance
- Review the [Dynamic SDK Documentation](https://docs.dynamic.xyz)

### Tutorial series summary

- **Part 1**: Set up Dynamic SDK, configure Wagmi, and create the provider structure
- **Part 2**: Use Dynamic SDK hooks, access wallet data, and build dashboard components
- **Part 3**: Understand data flow, troubleshoot issues, and add bonus enhancements

Congratulations on building your multi-wallet balance dashboard with Dynamic SDK!
