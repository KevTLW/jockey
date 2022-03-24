import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  const { token } = req.cookies;

  if (!token) {
    const nextUrl = req.nextUrl;
    nextUrl.pathname = "/";
    return NextResponse.redirect(nextUrl);
  }

  return NextResponse.next();
};
