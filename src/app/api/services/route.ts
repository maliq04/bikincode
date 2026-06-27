import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/firebase'
import { ref, get, set, remove, push } from 'firebase/database'

export const dynamic = 'force-dynamic'

// GET - Fetch all services
export async function GET() {
  try {
    const servicesRef = ref(database, 'services')
    const snapshot = await get(servicesRef)
    
    if (snapshot.exists()) {
      const servicesData = snapshot.val()
      const servicesArray = Object.keys(servicesData).map(key => ({
        id: key,
        ...servicesData[key]
      }))
      return NextResponse.json(servicesArray)
    }
    
    // Return empty array if no services exist
    return NextResponse.json([])
  } catch (error: any) {
    console.error('Error fetching services:', error)
    // Return empty array on error to prevent breaking the UI
    return NextResponse.json([])
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate new service ID
    const servicesRef = ref(database, 'services')
    const newServiceRef = push(servicesRef)
    const serviceId = newServiceRef.key
    
    // Add timestamps
    const serviceData = {
      ...body,
      id: serviceId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: body.status || 'active'
    }
    
    await set(newServiceRef, serviceData)
    
    return NextResponse.json({ 
      success: true, 
      service: serviceData 
    })
  } catch (error: any) {
    console.error('Error creating service:', error)
    
    // Check if it's a permission error
    if (error.code === 'PERMISSION_DENIED') {
      return NextResponse.json(
        { 
          error: 'Firebase permission denied. Please update database rules.',
          details: 'Visit Firebase Console > Realtime Database > Rules and set write permissions.',
          code: 'PERMISSION_DENIED'
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create service', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }
    
    const serviceRef = ref(database, `services/${id}`)
    
    // Update with new timestamp
    const updatedData = {
      ...updateData,
      id,
      updatedAt: Date.now()
    }
    
    await set(serviceRef, updatedData)
    
    return NextResponse.json({ 
      success: true, 
      service: updatedData 
    })
  } catch (error: any) {
    console.error('Error updating service:', error)
    
    // Check if it's a permission error
    if (error.code === 'PERMISSION_DENIED') {
      return NextResponse.json(
        { 
          error: 'Firebase permission denied. Please update database rules.',
          details: 'Visit Firebase Console > Realtime Database > Rules and set write permissions.',
          code: 'PERMISSION_DENIED'
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update service', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }
    
    const serviceRef = ref(database, `services/${id}`)
    await remove(serviceRef)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Service deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting service:', error)
    
    // Check if it's a permission error
    if (error.code === 'PERMISSION_DENIED') {
      return NextResponse.json(
        { 
          error: 'Firebase permission denied. Please update database rules.',
          details: 'Visit Firebase Console > Realtime Database > Rules and set write permissions.',
          code: 'PERMISSION_DENIED'
        },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete service', details: error.message },
      { status: 500 }
    )
  }
}
