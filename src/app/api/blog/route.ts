import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/firebase'
import { ref, set, get, remove, push } from 'firebase/database'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if database is initialized
    if (!database) {
      console.error('Firebase database not initialized')
      return NextResponse.json([])
    }

    const blogRef = ref(database, 'blog')
    const snapshot = await get(blogRef)
    
    if (snapshot.exists()) {
      const data = snapshot.val()
      const blogArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }))
      
      // Sort by date (newest first)
      blogArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      return NextResponse.json(blogArray)
    }
    
    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    // Return empty array instead of error to prevent UI breaking
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if database is initialized
    if (!database) {
      console.error('Firebase database not initialized')
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, category, tags, image, author, status, featured } = body

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate new ID
    const blogRef = ref(database, 'blog')
    const newBlogRef = push(blogRef)
    
    const blogData = {
      title,
      slug,
      excerpt,
      content,
      category,
      tags: tags || [],
      image: image || '',
      author: author || 'Admin',
      status: status || 'published',
      featured: featured || false,
      date: new Date().toISOString(),
      views: 0,
      readTime: content?.en ? calculateReadTime(content.en) : 1
    }

    await set(newBlogRef, blogData)

    return NextResponse.json({ 
      success: true, 
      id: newBlogRef.key,
      blog: blogData 
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create blog post'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, content, ...blogData } = body

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const blogRef = ref(database, `blog/${id}`)
    await set(blogRef, {
      ...blogData,
      content,
      readTime: calculateReadTime(content.en),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true, blog: { ...blogData, content } })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const blogRef = ref(database, `blog/${id}`)
    await remove(blogRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
