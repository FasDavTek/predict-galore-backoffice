// config/routes.js
export const publicRoutes = [
    '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/verify-otp',
  ];
  
  export const isPublicRoute = (pathname) => {
    return publicRoutes.includes(pathname);
  };