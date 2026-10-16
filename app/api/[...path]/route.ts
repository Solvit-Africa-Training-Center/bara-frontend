import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://shirt-shady-daisy.ngrok-free.dev"
).replace(/\/+$/, "")

// Hop-by-hop and encoding/length headers that must not be forwarded from upstream
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
])

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const joinedPath = path.join("/")
  const search = request.nextUrl.search || ""

  // Django endpoints strictly enforce trailing slash
  const trailingSlash = joinedPath.endsWith("/") ? "" : "/"
  const targetUrl = `${BACKEND_URL}/api/${joinedPath}${trailingSlash}${search}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (
      lower !== "host" &&
      lower !== "connection" &&
      lower !== "content-length" &&
      lower !== "accept-encoding"
    ) {
      headers.set(key, value)
    }
  })

  // Set headers to bypass ngrok browser warning & ensure JSON transport
  headers.set("ngrok-skip-browser-warning", "69420")
  headers.set("User-Agent", "BaraWeb-Proxy/1.0")
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json")
  }

  const method = request.method
  const body =
    method !== "GET" && method !== "HEAD" ? await request.arrayBuffer() : undefined

  try {
    const backendRes = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "follow",
    })

    const responseHeaders = new Headers()
    backendRes.headers.forEach((value, key) => {
      const lower = key.toLowerCase()
      if (!HOP_BY_HOP_HEADERS.has(lower)) {
        responseHeaders.set(key, value)
      }
    })

    // Forward cookies properly if backend sets cookies
    const setCookies = backendRes.headers.getSetCookie?.()
    if (setCookies && setCookies.length > 0) {
      responseHeaders.delete("set-cookie")
      for (const cookie of setCookies) {
        responseHeaders.append("set-cookie", cookie)
      }
    }

    const data = await backendRes.arrayBuffer()

    if (backendRes.status >= 400) {
      try {
        const decoded = new TextDecoder().decode(data)
        console.warn(`[Backend ${backendRes.status}] ${targetUrl}:`, decoded)
        try {
          const fs = await import("fs")
          fs.appendFileSync(
            "backend_debug.log",
            `${new Date().toISOString()} [${backendRes.status}] ${targetUrl} Auth:${Boolean(headers.get("authorization"))}\nBody: ${decoded}\n\n`
          )
        } catch {
          // ignore fs errors
        }
      } catch {
        // ignore decoding errors
      }
    }

    return new NextResponse(data, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    })
  } catch (err: unknown) {
    console.error("Proxy Error:", {
      url: targetUrl,
      error: err instanceof Error ? err.message : "Unknown error",
    })
    return NextResponse.json(
      {
        detail:
          err instanceof Error
            ? `Proxy connection failed: ${err.message}`
            : "Proxy connection failed",
      },
      { status: 502 }
    )
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const PATCH = proxyRequest
export const DELETE = proxyRequest
export const OPTIONS = proxyRequest
