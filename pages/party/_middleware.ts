import { NextRequest, NextResponse } from "next/server";

export const middleware = (req: NextRequest) => {
  const { token } = req.cookies;

  if (!token) {
    const nextUrl = req.nextUrl;
    nextUrl.pathname = "/";
    if (req.page.params !== undefined) {
      nextUrl.searchParams.append("party", req.page.params?.id!);
    }

    return NextResponse.redirect(nextUrl);
  }

  return NextResponse.next();
};
