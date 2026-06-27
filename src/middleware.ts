import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Allow access to business website pages without authentication
    const publicPaths = [
      '/',
      '/portfolio',
      '/marketplace',
      '/affiliate',
      '/about',
      '/services',
      '/blog',
      '/contact'
    ]

    if (publicPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next()
    }

    // Redirect to signin if not authenticated and trying to access protected routes
    if (!token && (pathname.startsWith('/admin') || pathname.startsWith('/employee'))) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Redirect to appropriate dashboard if authenticated and trying to access auth pages
    if (token && pathname.startsWith('/auth/')) {
      const redirectUrl = token.role === 'EMPLOYEE' ? '/employee' : '/admin'
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    // Role-based access control for admin routes
    if (token && pathname.startsWith('/admin')) {
      const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'HR', 'MANAGER']
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL('/employee', req.url))
      }
    }

    if (token && pathname.startsWith('/employee')) {
      // All authenticated users can access employee portal
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to public business website routes
        const publicPaths = [
          '/',
          '/portfolio',
          '/marketplace',
          '/affiliate',
          '/about',
          '/services',
          '/blog',
          '/contact',
          '/auth/'
        ]

        if (publicPaths.some(path => pathname.startsWith(path))) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}