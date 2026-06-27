import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from '@convex-dev/auth/nextjs/server';
import { NextRequest } from 'next/server';

const isPublicPage = createRouteMatcher(['/auth']);

function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const isLocalhost = /localhost:\d+/.test(request.headers.get('host') ?? '');
  const prefix = isLocalhost ? '' : '__Host-';
  return request.cookies.has(`${prefix}__convexAuthJWT`);
}

export default convexAuthNextjsMiddleware(async (request) => {
  const authenticated = isAuthenticatedFromRequest(request);

  if (!isPublicPage(request) && !authenticated) {
    return nextjsMiddlewareRedirect(request, '/auth');
  }

  if (isPublicPage(request) && authenticated) {
    return nextjsMiddlewareRedirect(request, '/');
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
