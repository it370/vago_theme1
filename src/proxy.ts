import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PREFIXES = [
  "/cart",
  "/wishlist",
  "/profile",
  "/orders",
  "/checkout",
  "/notifications",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (isPrivate) {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)" ],
};
