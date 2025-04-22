/**
 * Application Configuration
 * 
 * This file contains the main configuration for the Angular application,
 * particularly focused on dependency injection providers.
 * 
 * IMPORTANT CONCEPTS:
 * 1. Standalone Application API: Angular's modern approach for configuring 
 *    applications without NgModules
 * 
 * 2. Providers: Services and configurations made available for dependency injection
 * 
 * 3. Functional Providers: Modern functional approach to configuring providers
 *    rather than using traditional provider objects
 * 
 * The configuration currently includes:
 * - Router: For navigation between components based on URL
 * - HttpClient: For making API requests to the backend
 * - Animations: For enabling Angular Material animations
 */
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Router Provider
     * Configures Angular's router with our defined routes
     * This enables navigation between different components
     */
    provideRouter(routes),
    
    /**
     * HttpClient Provider
     * Enables making HTTP requests to external APIs
     * 
     * Note: In a more complete setup, this would include the authInterceptor:
     * provideHttpClient(withInterceptors([authInterceptor]))
     * 
     * The interceptor would automatically add authentication headers to requests
     */
    provideHttpClient(),
    
    /**
     * Animations Provider
     * Required for Angular Material components to display animations properly
     * Without this, Material components would still function but without transition effects
     */
    provideAnimations()
  ]
};
