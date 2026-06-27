import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/firebase'
import { ref, get, set, remove, push } from 'firebase/database'

export const dynamic = 'force-dynamic'

// GET - Fetch all portfolio items
export async function GET() {
  try {
    const portfolioRef = ref(database, 'portfolio')
    const snapshot = await get(portfolioRef)
    
    if (snapshot.exists()) {
      const portfolioData = snapshot.val()
      const portfolioArray = Object.keys(portfolioData).map(key => ({
        id: key,
        ...portfolioData[key]
      }))
      // Sort by createdAt descending (newest first)
      portfolioArray.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
      return NextResponse.json(portfolioArray)
    }
    
    return NextResponse.json([])
  } catch (error: any) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json([])
  }
}

// POST - Create new portfolio item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const portfolioRef = ref(database, 'portfolio')
    const newPortfolioRef = push(portfolioRef)
    const portfolioId = newPortfolioRef.key
    
    const portfolioData = {
      ...body,
      id: portfolioId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: body.status || 'published'
    }
    
    await set(newPortfolioRef, portfolioData)
    
    return NextResponse.json({ 
      success: true, 
      portfolio: portfolioData 
    })
  } catch (error: any) {
    console.error('Error creating portfolio:', error)
    
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
      { error: 'Failed to create portfolio', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Update portfolio item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      )
    }
    
    const portfolioRef = ref(database, `portfolio/${id}`)
    
    const updatedData = {
      ...updateData,
      id,
      updatedAt: Date.now()
    }
    
    await set(portfolioRef, updatedData)
    
    return NextResponse.json({ 
      success: true, 
      portfolio: updatedData 
    })
  } catch (error: any) {
    console.error('Error updating portfolio:', error)
    
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
      { error: 'Failed to update portfolio', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete portfolio item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      )
    }
    
    const portfolioRef = ref(database, `portfolio/${id}`)
    await remove(portfolioRef)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting portfolio:', error)
    
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
      { error: 'Failed to delete portfolio', details: error.message },
      { status: 500 }
    )
  }
}
