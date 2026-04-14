export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/setup',
    '/interview/:path*',
    '/evaluation/:path*',
    '/history',
    '/account',
    '/api/sessions/:path*',
    '/api/interview/:path*',
    '/api/account/:path*',
  ],
}
