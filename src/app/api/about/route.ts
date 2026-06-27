import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/firebase'
import { ref, get, update } from 'firebase/database'

export const dynamic = 'force-dynamic'

// Default about data
const defaultAboutData = {
  companyName: {
    en: 'CV. BikinCode Solution',
    id: 'CV. BikinCode Solution'
  },
  description: {
    en: 'Our company is an IT consulting firm based in Lahat Regency, South Sumatra, officially established in 2026. We specialize in providing innovative technology solutions to help businesses transform digitally and achieve their goals.',
    id: 'Perusahaan kami adalah firma konsultan IT yang berbasis di Kabupaten Lahat, Sumatera Selatan, resmi didirikan pada tahun 2026. Kami mengkhususkan diri dalam menyediakan solusi teknologi inovatif untuk membantu bisnis bertransformasi secara digital dan mencapai tujuan mereka.'
  },
  vision: {
    en: 'To become a key strategic partner supporting digital transformation in Indonesia, delivering innovative and sustainable technology solutions.',
    id: 'Menjadi mitra strategis utama yang mendukung transformasi digital di Indonesia, menghadirkan solusi teknologi yang inovatif dan berkelanjutan.'
  },
  mission: {
    en: 'To provide innovative, reliable, and results-oriented technology services. We are committed to understanding client needs and delivering solutions that drive business growth.',
    id: 'Menyediakan layanan teknologi yang inovatif, andal, dan berorientasi pada hasil. Kami berkomitmen untuk memahami kebutuhan klien dan memberikan solusi yang mendorong pertumbuhan bisnis.'
  },
  companyLogo: '',
  stats: {
    projects: 200,
    clients: 150,
    teamMembers: 25,
    satisfaction: 98
  },
  technologies: [
    'React',
    'Next.js',
    'Node.js',
    'Laravel',
    'Flutter',
    'TypeScript',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'Firebase',
    'Docker',
    'AWS'
  ]
}

export async function GET() {
  try {
    const aboutRef = ref(database, 'aboutData')
    const snapshot = await get(aboutRef)
    
    if (snapshot.exists()) {
      const data = snapshot.val()
      return NextResponse.json(data)
    } else {
      // Return default data if no data exists
      return NextResponse.json(defaultAboutData)
    }
  } catch (error) {
    console.error('Error fetching about data:', error)
    // Return default data on error
    return NextResponse.json(defaultAboutData)
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const aboutRef = ref(database, 'aboutData')
    await update(aboutRef, body)

    console.log('About data updated in Firebase')
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    console.error('Error updating about data:', error)
    
    if (error instanceof Error && error.message.includes('PERMISSION_DENIED')) {
      return NextResponse.json({ 
        error: 'Firebase permission denied. Please check your Firebase security rules.',
        details: 'The Firebase Realtime Database security rules may be blocking write operations.'
      }, { status: 403 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to update about data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
