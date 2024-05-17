import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface IRoots {
  [key: string]: boolean;
}

const publicOnlyUrls: IRoots = {
  "/": true,
  "/login": true,
  "/create-account": true,
  "/sms": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exits = publicOnlyUrls[request.nextUrl.pathname];

  if (!session.id) {
    if (!exits) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (exits) {
      return NextResponse.redirect(new URL("/produts", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
