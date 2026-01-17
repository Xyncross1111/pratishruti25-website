import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_auth";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const isAuthed = cookie.split(/;\s*/).some((c) => c.startsWith(`${COOKIE_NAME}=`));
  return NextResponse.json({ ok: isAuthed });
}
