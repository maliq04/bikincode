'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the portfolio detail component with no SSR
const PortfolioDetail = dynamic(() => import('./PortfolioDetail'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl text-gray-600">Loading portfolio...</div>
      </div>
    </div>
  ),
})

export default function PortfolioDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    }>
      <PortfolioDetail />
    </Suspense>
  )
}
