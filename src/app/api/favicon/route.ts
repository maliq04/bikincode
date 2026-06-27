import { NextResponse } from 'next/server'
import { database } from '@/lib/firebase'
import { ref, get } from 'firebase/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settingsRef = ref(database, 'companySettings/companyLogo')
    const snapshot = await get(settingsRef)

    if (snapshot.exists()) {
      const logoUrl = snapshot.val()
      if (logoUrl) {
        // Redirect to the actual logo URL
        return NextResponse.redirect(logoUrl)
      }
    }
  } catch (error) {
    // Fall through to default
  }

  // Return a default favicon (transparent 1x1 pixel)
  return new NextResponse(null, { status: 404 })
}
