import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const uploadPath = formData.get('uploadPath') as string

    console.log('File:', file?.name, 'Upload path:', uploadPath)

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!uploadPath) {
      return NextResponse.json({ error: 'No upload path provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images only.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 })
    }

    // Create unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${uploadPath.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`

    console.log('Generated filename:', fileName)

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadPath)
    console.log('Upload directory:', uploadDir)
    
    if (!existsSync(uploadDir)) {
      console.log('Creating directory:', uploadDir)
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadDir, fileName)
    console.log('File path:', filePath)
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)
    console.log('File saved successfully')

    // Return public URL
    const publicUrl = `/uploads/${uploadPath}/${fileName}`
    console.log('Public URL:', publicUrl)

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Failed to upload file. Please try again.' 
    }, { status: 500 })
  }
}