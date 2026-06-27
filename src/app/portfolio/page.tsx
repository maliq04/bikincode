import { Portfolio } from '@/components/sections/Portfolio'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Portfolio />
      </div>
      <Footer />
    </div>
  )
}