import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/party(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isProtectedRoute(request)) {
    const isAuthenticated = await convexAuth.isAuthenticated();
    if (!isAuthenticated) {
      const partyMatch = request.nextUrl.pathname.match(/\/party\/(.+)/);
      const partyId = partyMatch?.[1];
      return nextjsMiddlewareRedirect(
        request,
        partyId ? `/?party=${partyId}` : "/"
      );
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
