import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // rutas públicas
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register')
  ) {
    return NextResponse.next()
  }

  // revisar cookie de sesión
  const token = request.cookies.get('sb-access-token')

  // si NO hay sesión → redirigir
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}