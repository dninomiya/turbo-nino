import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // これは改竄可能なCookieを使用した簡易的なリダイレクトです。
  // 各ページ/ルートで必ず認証チェックを行ってください
  if (!sessionCookie) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  // 認証で保護するルートを指定
  matcher: ["/dashboard"],
};
