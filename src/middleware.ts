import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const userRole = req.cookies.get("userRole")?.value;
  const isLoggedIn = !!userRole;
  const isOnAuthPage = pathname.startsWith("/auth");
  const isOnAdminPage = pathname.startsWith("/admin");

  // Redirect user yang belum login
  if (!isLoggedIn && !isOnAuthPage) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Jika sudah login tapi akses /auth, arahkan ke dashboard atau admin
  if (isLoggedIn && isOnAuthPage) {
    return NextResponse.redirect(
      new URL(userRole === "ADMIN" ? "/admin" : "/", req.url)
    );
  }

  // Batasi akses admin route hanya untuk ADMIN
  if (isOnAdminPage && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [ "/admin/:path*", "/auth/:path*"],
};
