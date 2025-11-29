import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Skip middleware if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  // Only protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // For now, just let it through - auth check happens in the page
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
