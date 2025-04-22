/**
 * Application Routing Configuration
 * 
 * This file defines all the routes in the Angular application, mapping URL paths
 * to their corresponding components.
 * 
 * IMPORTANT CONCEPTS:
 * 1. Route Definitions: Each route maps a URL path to a component
 * 
 * 2. Route Parameters: The 'edit/:id' route demonstrates parameterized routes
 *    where :id is a dynamic value extracted by components
 * 
 * 3. Wildcard Route: The '**' path catches all undefined routes and redirects
 *    to the home page, preventing 404 errors
 * 
 * 4. Lazy Loading: In larger applications, routes can be configured for lazy loading
 *    to improve initial load performance (not implemented here)
 * 
 * Note: This application uses client-side routing provided by Angular's Router,
 * which changes the view without full page reloads for a smoother user experience.
 */
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NewBlogComponent } from './components/new-blog/new-blog.component';
import { EditBlogComponent } from './components/edit-blog/edit-blog.component';

export const routes: Routes = [
  /**
   * Home route - displays the list of all blogs
   * This is the default route when no path is specified
   */
  { path: '', component: HomeComponent },
  
  /**
   * Login route - displays the login form
   * Accessible by both authenticated and unauthenticated users
   * The component itself redirects authenticated users to home
   */
  { path: 'login', component: LoginComponent },
  
  /**
   * New blog route - displays the form for creating a new blog
   * The component handles authentication checks internally
   */
  { path: 'blog/new', component: NewBlogComponent },
  
  /**
   * Edit blog route - displays the form for editing an existing blog
   * Contains a route parameter (:id) that specifies which blog to edit
   * The EditBlogComponent extracts this parameter to load the correct blog
   */
  { path: 'blog/edit/:id', component: EditBlogComponent },
  
  /**
   * Wildcard route - catches all undefined routes
   * Redirects users to the home page, preventing 404 errors
   * This should always be the last route in the configuration
   */
  { path: '**', redirectTo: '' }
];
