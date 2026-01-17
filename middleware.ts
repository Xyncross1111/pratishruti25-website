import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect score update API; allow /admin to render login UI client-side.
  if (pathname.startsWith("/api/updateScores")) {
    const authed = req.cookies.get(COOKIE_NAME)?.value === "true";
    if (!authed) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/updateScores"],
};
