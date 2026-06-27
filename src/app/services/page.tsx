import { Services } from '@/components/sections/Services'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Services />
      </div>
      <Footer />
    </div>
  )
}