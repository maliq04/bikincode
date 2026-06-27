import { NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function GET() {
  try {
    // Test Firebase Storage connection
    const testRef = ref(storage, 'test/connection-test.txt')
    const testData = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in bytes
    
    await uploadBytes(testRef, testData)
    const downloadURL = await getDownloadURL(testRef)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Firebase Storage connection successful',
      testUrl: downloadURL
    })
  } catch (error) {
    console.error('Firebase Storage test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Firebase Storage connection failed'
    }, { status: 500 })
  }
}