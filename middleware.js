import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;

  const path = req.nextUrl.pathname;
  const isLoginPage = path === "/login";

  // Not logged in
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Already logged in → keep them away from login
  if (token && isLoginPage) {
    return NextResponse.redirect(
      new URL(role === "counterPerson" ? "/booking" : "/executives", req.url)
    );
  }

  // Protect CounterPerson-only pages
  if (
    (path.startsWith("/commission") || path.startsWith("/booking")) &&
    role !== "counterPerson"
  ) {
    return NextResponse.redirect(new URL("/executives", req.url));
  }

  // Protect Executive-only pages
  if (path.startsWith("/executives") && role !== "ticketExecutive") {
    return NextResponse.redirect(new URL("/booking", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/booking/:path*",
    "/commission/:path*",
    "/executives/:path*",
    "/login",
  ],
};
