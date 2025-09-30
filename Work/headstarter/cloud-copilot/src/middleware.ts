import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        // Protect API routes
        if (req.nextUrl.pathname.startsWith("/api/scans") || 
            req.nextUrl.pathname.startsWith("/api/user")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/scans/:path*",
    "/api/user/:path*"
  ]
}
