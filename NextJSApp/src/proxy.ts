import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXT_JWT_SECRET!)

async function verifyAccessToken(token: string) {
  try {
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export default async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value

  // ✅ 1. Validate access token
  if (accessToken) {
    const isValid = await verifyAccessToken(accessToken)

    if (isValid) {
      return NextResponse.next()
    }
  }

  // ❌ 2. If invalid/missing → try refresh
  try {
    const refreshResponse = await fetch(
      `${req.nextUrl.origin}/api/Auth/Refresh-Token`,
      {
        method: 'GET',
        headers: {
          cookie: req.headers.get('cookie') || '',
          "x-internal-request": process.env.NEXT_INTERNAL_API_CALL_SECRET || ''
        },
      }
    )

    if (!refreshResponse.ok) {
      return NextResponse.redirect(new URL('/Login', req.url))
    }

    const data = await refreshResponse.json()

    const res = NextResponse.next()

    // set new tokens
    if (data?.accessToken) {
      res.cookies.set('accessToken', data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 15, // 15 mins,
        path: '/'
      })
    }

    if (data?.refreshToken) {
      res.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days,
        path: '/'
      })
    }

    return res
  } catch {
    return NextResponse.redirect(new URL('/Login', req.url))
  }
}

export const config = {
  matcher: ['/', '/category/:path*', '/Chat/:path*', '/Create-Job/:path*', '/job/:path*', '/Profile/:path*', '/Proposal/:path*'],
}