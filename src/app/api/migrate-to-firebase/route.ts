import { NextResponse } from 'next/server'
import { database } from '@/lib/firebase'
import { ref, set, get } from 'firebase/database'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    console.log('Initializing Firebase settings...')
    
    // Check if settings already exist in Firebase
    const settingsRef = ref(database, 'companySettings')
    const snapshot = await get(settingsRef)
    
    if (snapshot.exists()) {
      return NextResponse.json({
        success: true,
        message: 'Settings already exist in Firebase',
        data: snapshot.val()
      })
    }

    // Initialize default settings in Firebase
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
      contactPhone: '+62 813 6124 9456'
    }

    await set(settingsRef, defaultSettings)
    
    console.log('Default settings initialized in Firebase:', defaultSettings)
    
    return NextResponse.json({
      success: true,
      message: 'Default settings initialized in Firebase successfully',
      data: defaultSettings
    })

  } catch (error) {
    console.error('Error initializing Firebase settings:', error)
    
    if (error instanceof Error && error.message.includes('PERMISSION_DENIED')) {
      return NextResponse.json({
        success: false,
        message: 'Firebase permission denied. Please check your Firebase security rules.',
        error: 'PERMISSION_DENIED'
      }, { status: 403 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize Firebase settings',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Check current data in Firebase
    const settingsRef = ref(database, 'companySettings')
    const snapshot = await get(settingsRef)
    
    if (snapshot.exists()) {
      return NextResponse.json({
        success: true,
        firebase: {
          exists: true,
          data: snapshot.val()
        },
        message: 'Firebase settings found'
      })
    } else {
      return NextResponse.json({
        success: true,
        firebase: {
          exists: false,
          data: null
        },
        message: 'No Firebase settings found. Use POST to initialize.'
      })
    }

  } catch (error) {
    console.error('Error checking Firebase status:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to check Firebase status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}