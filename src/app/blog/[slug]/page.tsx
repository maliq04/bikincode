'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const BlogDetail = dynamic(() => import('./BlogDetail'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl text-gray-600">Loading blog post...</div>
      </div>
    </div>
  ),
})

export default function BlogDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    }>
      <BlogDetail />
    </Suspense>
  )
}
