import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const { token } = req.cookies;

  if (!token) {
    const nextUrl = req.nextUrl;
    nextUrl.pathname = "/";
    if (req.page.params !== undefined) {
      nextUrl.searchParams.append("party", req.page.params?.id!);
    }

    return NextResponse.redirect(nextUrl);
  }

  if (req.page.params?.id !== undefined) {
    const { exists } = await fetch(
      `${req.nextUrl.origin}/api/party?id=${req.page.params?.id}`
    ).then((res) => res.json());

    if (!exists) {
      const nextUrl = req.nextUrl;
      nextUrl.pathname = "/party";

      return NextResponse.redirect(nextUrl);
    }
  }

  return NextResponse.next();
};
