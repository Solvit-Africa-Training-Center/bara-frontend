import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const GUEST_AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

function isGuestAuthRoute(pathname: string): boolean {
  return GUEST_AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Completely bypass Next.js internals, static assets, and APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  const isLoggedOut =
    request.cookies.get("bara_auth_logged_out")?.value === "true"
  const hasAccessToken = Boolean(request.cookies.get("bara_access_token")?.value)
  const hasRefreshToken = Boolean(request.cookies.get("bara_refresh_token")?.value)
  const hasUser = Boolean(request.cookies.get("bara_auth_user")?.value)
  const hasToken = hasAccessToken || hasRefreshToken

  const isAuthenticated = !isLoggedOut && hasToken && hasUser

  // 1. If user is logged in, block access to login, register, and other auth pages
  if (isAuthenticated && isGuestAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // 2. If user is NOT authenticated and tries to access protected pages, redirect to login
  if (
    !isAuthenticated &&
    !isGuestAuthRoute(pathname) &&
    !pathname.startsWith("/errors") &&
    !pathname.startsWith("/setup") &&
    !pathname.startsWith("/onboarding")
  ) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    if (!hasUser && (hasAccessToken || hasRefreshToken)) {
      response.cookies.delete("bara_access_token")
      response.cookies.delete("bara_refresh_token")
      response.cookies.delete("bara_auth_user")
    }
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

export default proxy
