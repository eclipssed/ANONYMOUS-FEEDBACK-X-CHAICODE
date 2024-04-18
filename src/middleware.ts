import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
//  import type { NextRequest, NextResponse } from 'next/server'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // const path = request.nextUrl.pathname;
  // const isPublicPath =
  //   path === "/login" || path === "signup" || path === "verifyemail";
  // const token = request.cookies.get("token")?.value || "";
  // if (isPublicPath && token) {
  //   return NextResponse.redirect(new URL("/profile", request.url));
  // }
  // if (!isPublicPath && !token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/signin", "/signup", "/dashboard/:path*", "/verify/:path*"],
};
