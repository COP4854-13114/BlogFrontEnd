/**
 * Root Application Component
 * 
 * This is the main/root component of the Angular application.
 * It serves as the container for all other components and defines the basic layout.
 * 
 * IMPORTANT CONCEPTS:
 * 1. Standalone Component: Uses Angular's standalone component pattern without NgModules
 * 
 * 2. Component Composition: Composes the UI by including other components (NavbarComponent)
 * 
 * 3. Router Outlet: Provides a placeholder where routed components are rendered
 * 
 * The structure of the application UI is:
 * - App Component (root)
 *   - Navbar Component (consistent across all views)
 *   - Router Outlet (dynamic content based on current route)
 *     - Home Component OR
 *     - Login Component OR
 *     - NewBlog Component OR
 *     - EditBlog Component
 */
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  /**
   * Application title
   * This could be used in the template or for browser tab titles
   */
  title = 'Blog Application';
}
