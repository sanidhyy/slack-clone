import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isPublicPage = createRouteMatcher(['/auth']);

export default convexAuthNextjsMiddleware((req) => {
  if (!isPublicPage(req) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(req, '/auth');
  }

  // TODO: redirect user away from "/auth" if authenticated
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
