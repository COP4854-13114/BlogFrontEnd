/**
 * Authentication Interceptor
 * 
 * This file implements an HTTP interceptor that automatically adds
 * authentication tokens to outgoing HTTP requests.
 * 
 * IMPORTANT CONCEPTS:
 * 1. Functional Interceptors: Angular 16+ introduced functional interceptors
 *    that replace class-based interceptors for a more streamlined approach
 * 
 * 2. Request Cloning: HTTP requests are immutable and must be cloned to modify
 * 
 * 3. Token Management: Automatically attaches JWT tokens from localStorage
 */
import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Empty interface for potential future expansion
 * Note: With functional interceptors, this interface isn't strictly necessary
 */
export interface AuthInterceptor {
}

/**
 * Functional HTTP interceptor that adds authentication tokens to outgoing requests
 * 
 * @param req The original HTTP request
 * @param next The next handler in the interceptor chain
 * @returns An Observable of the HTTP event stream
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the token from localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    // HTTP requests are immutable, so we need to clone the request to modify it
    const cloned = req.clone({
      // Add the Authorization header with the Bearer token
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // Continue with the modified request
    return next(cloned);
  }
  
  // If no token exists, proceed with the original request
  return next(req);
};
