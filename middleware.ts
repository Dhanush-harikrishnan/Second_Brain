import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: (req) => isPublicRoute(req.url),
});
 
export const config = {
  // Runs the middleware on all routes except static files and api routes that need to be public
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
