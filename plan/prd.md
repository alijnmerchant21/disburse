# Product Requirements Document

## Problem Statement

Many users hold digital assets across multiple wallets and chains, and current web3 tools either show balances per wallet or require complex navigation between interfaces. There’s no simple unified view aimed at non-crypto users, making it hard to understand total holdings.

Disburse addresses this by aggregating balances from multiple connected wallets into a single, simple dashboard.

## Objective

Build a simple web application where users can:

- Authenticate via Dynamic,
- Connect multiple wallets across chains,
- View consolidated balances (in native tokens and fiat),
- Interact in a clear, non-crypto UX.

This should be deployable, tutorial-ready, and reproducible.

## Target Users

- Novice web3 holders unfamiliar with wallets or chains
- Developers wanting a quick demo/example of Dynamic capabilities
- Product teams exploring multi-wallet portfolio views

## Key Features

1. User Authentication
Users log in via Dynamic — this unlocks identity and wallet management without seed phrases. Under the hood, Dynamic’s login combines authentication and wallet linking.

2. Wallet Linking & Multi-Chain Support
Users can connect multiple wallets (e.g., MetaMask, Phantom, WalletConnect, Ledger) and switch between them or show all at once. All wallet connectors are handled via Dynamic’s multi-chain wallet adapter.

3. Balance Aggregation
The system fetches token balances from each connected wallet across all supported chains and aggregates them.

4. Dashboard UI
A clean UI showing:

- Total balance at the top
- Wallet tiles w/ per-chain balances
- Optional toggle between native and fiat

5. User Experience Enhancements

- Simple onboarding text
- Tooltips explaining the purpose of wallets and balances
- Friendly copy (e.g., “Your total crypto holdings”)
