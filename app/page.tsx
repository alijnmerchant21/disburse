'use client'

import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { Dashboard } from '@/components/Dashboard'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

// Force dynamic rendering to avoid SSR issues with Dynamic SDK
export const dynamic = 'force-dynamic'

export default function Home() {
  const { user } = useDynamicContext()
  const isAuthenticated = !!user

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-12 fade-in">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              Disburse
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Your unified crypto balance dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DynamicWidget />
          </div>
        </header>

        {/* Main Content */}
        {isAuthenticated ? (
          <Dashboard />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center fade-in">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="mb-8">
                <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl card-hover">
                  <svg
                    className="w-16 h-16 text-white"
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
              </div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Welcome to Disburse
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
                Connect your wallets to see all your crypto holdings in one
                place. We support multiple wallets and chains, giving you a
                clear view of your total portfolio.
              </p>
              <div className="pt-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Click the button above to get started
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
