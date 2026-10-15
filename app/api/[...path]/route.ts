import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://shirt-shady-daisy.ngrok-free.dev"
).replace(/\/+$/, "")

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
    if (lower !== "host" && lower !== "connection") {
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
      if (
        lower !== "content-encoding" &&
        lower !== "transfer-encoding"
      ) {
        responseHeaders.set(key, value)
      }
    })

    const data = await backendRes.arrayBuffer()
    return new NextResponse(data, {
      status: backendRes.status,
      statusText: backendRes.statusText,
      headers: responseHeaders,
    })
  } catch (err: unknown) {
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
