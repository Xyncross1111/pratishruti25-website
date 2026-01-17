import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const COOKIE_NAME = "admin_auth";

export async function POST(request: Request) {
  if (!ADMIN_PASSWORD) {
    return new NextResponse("ADMIN_PASSWORD not set", { status: 500 });
  }

  try {
    const body = await request.json();
    const { password } = body || {};
    if (password !== ADMIN_PASSWORD) {
      return new NextResponse("Invalid password", { status: 401 });
    }

    const res = new NextResponse(JSON.stringify({ ok: true }), { status: 200 });
    res.cookies.set(COOKIE_NAME, "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return res;
  } catch (e) {
    console.error(e);
    return new NextResponse("Bad request", { status: 400 });
  }
}
