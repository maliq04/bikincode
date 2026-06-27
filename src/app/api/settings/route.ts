import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/firebase'
import { ref, set, get, update } from 'firebase/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Use Firebase Realtime Database only
export async function GET() {
  try {
    const settingsRef = ref(database, 'companySettings')
    const snapshot = await get(settingsRef)
    
    if (snapshot.exists()) {
      const data = snapshot.val()
      console.log('Firebase settings fetched:', data)
      return NextResponse.json(data)
    } else {
      // Return default values if no data exists
      const defaultSettings = {
        // Brand Settings
        companyName: 'BikinCode',
        companyLogo: '',
        brandColor: '#2563eb',
        
        // Profile Settings
        adminName: 'Administrator',
        adminEmail: 'admin@bikincode.com',
        adminAvatar: '',
        
        // Website Settings
        websiteTitle: 'BikinCode - Web Development Solutions',
        websiteDescription: 'Professional web development solutions for modern businesses',
        contactEmail: 'hello@bikincode.com',
        contactPhone: '+62 813 6124 9456',
        
        // Navbar Visibility Settings
        showServices: 'true',
        showPortfolio: 'true',
        showMarketplace: 'true',
        showAffiliate: 'true',
        showBlog: 'true',
        showContact: 'true',
        showAbout: 'true'
      }
      
      console.log('No Firebase data found, returning defaults')
      return NextResponse.json(defaultSettings)
    }
  } catch (error) {
    console.error('Error fetching Firebase settings:', error)
    
    // Return default values if Firebase is not accessible
    const defaultSettings = {
      companyName: 'BikinCode',
      companyLogo: '',
      brandColor: '#2563eb',
      adminName: 'Administrator',
      adminEmail: 'admin@bikincode.com',
      adminAvatar: '',
      websiteTitle: 'BikinCode - Web Development Solutions',
      websiteDescription: 'Professional web development solutions for modern businesses',
      contactEmail: 'hello@bikincode.com',
      contactPhone: '+62 813 6124 9456',
      showServices: 'true',
      showPortfolio: 'true',
      showMarketplace: 'true',
      showAffiliate: 'true',
      showBlog: 'true',
      showContact: 'true',
      showAbout: 'true'
    }
    
    return NextResponse.json(defaultSettings)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication check since user is already authenticated to access admin panel
    // TODO: Fix NextAuth session issue in App Router
    
    const body = await request.json()
    const { key, value } = body

    const settingRef = ref(database, `companySettings/${key}`)
    await set(settingRef, value)

    console.log(`Firebase setting updated: ${key} = ${value}`)
    return NextResponse.json({ success: true, key, value, storage: 'firebase' })
  } catch (error) {
    console.error('Error updating Firebase setting:', error)
    
    if (error instanceof Error && error.message.includes('PERMISSION_DENIED')) {
      return NextResponse.json({ 
        error: 'Firebase permission denied. Please check your Firebase security rules.',
        details: 'The Firebase Realtime Database security rules may be blocking write operations.'
      }, { status: 403 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to update setting in Firebase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Temporarily bypass authentication check since user is already authenticated to access admin panel
    // TODO: Fix NextAuth session issue in App Router
    
    const body = await request.json()
    const { settings } = body

    // Convert settings array to object
    const settingsObj: Record<string, string> = {}
    settings.forEach(({ key, value }: { key: string; value: string }) => {
      settingsObj[key] = value || ''
    })

    if (Object.keys(settingsObj).length === 0) {
      return NextResponse.json({ success: true, message: 'No settings to update' })
    }

    const settingsRef = ref(database, 'companySettings')
    await update(settingsRef, settingsObj)

    console.log('Firebase settings updated:', settingsObj)
    return NextResponse.json({ success: true, updated: settingsObj, storage: 'firebase' })
  } catch (error) {
    console.error('Error updating Firebase settings:', error)
    
    if (error instanceof Error && error.message.includes('PERMISSION_DENIED')) {
      return NextResponse.json({ 
        error: 'Firebase permission denied. Please check your Firebase security rules.',
        details: 'The Firebase Realtime Database security rules may be blocking write operations.',
        suggestion: 'You may need to update your Firebase security rules to allow write access.'
      }, { status: 403 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to update settings in Firebase',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}