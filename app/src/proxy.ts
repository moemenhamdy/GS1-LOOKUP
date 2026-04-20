import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In-memory store for Edge environment rate limiting (per isolate)
// Uses simple sliding window tracking
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per IP per minute per edge node

export function middleware(request: NextRequest) {
  // Only apply to /api/ routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 1. IP Rate Limiting
  let ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
           request.headers.get("x-real-ip") || 
           "unknown";
           
  const now = Date.now();
  const clientData = rateLimitMap.get(ip);

  if (clientData) {
    if (now > clientData.expiresAt) {
      // Reset window
      rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    } else {
      clientData.count++;
      if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }
  } else {
    // New IP
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    
    // Prune map occasionally to prevent memory leak on edge node
    if (rateLimitMap.size > 1000) {
      for (const [key, val] of rateLimitMap.entries()) {
        if (now > val.expiresAt) rateLimitMap.delete(key);
      }
    }
  }

  // 2. Strict Custom Header Validation (Anti-CSRF / Anti-Scraping)
  // Ensure the client sends our hardcoded custom header
  const isInternalClient = request.headers.get("x-gs1-client");
  if (isInternalClient !== "true") {
    return NextResponse.json(
      { error: "Forbidden: Unauthorized client request." },
      { status: 403 }
    );
  }

  // 3. Sec-Fetch-Site Validation
  // Ensure modern browsers flag this as a same-origin request
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    return NextResponse.json(
      { error: "Forbidden: Cross-origin requests are not permitted." },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
