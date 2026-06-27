import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

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

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow all public routes — no auth required
        const publicPaths = [
          '/',
          '/portfolio',
          '/marketplace',
          '/affiliate',
          '/about',
          '/services',
          '/blog',
          '/contact',
          '/auth',   // covers /auth/signin, /auth/error, etc.
        ]

        if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/') || pathname.startsWith(path + '?'))) {
          return true
        }

        // Require authentication for /admin and /employee only
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
