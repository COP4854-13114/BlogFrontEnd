/**
 * Navbar Component
 * 
 * This component provides the application's main navigation bar, displaying:
 * - Application title/logo
 * - Navigation links
 * - Login/logout functionality
 * - Current username when authenticated
 * 
 * IMPORTANT CONCEPTS:
 * 1. Standalone Component: Uses Angular's standalone component pattern
 *    without traditional NgModule
 * 
 * 2. Signal Integration: Connects directly to AuthService signals for reactive updates
 * 
 * 3. Dependency Injection: Uses Angular's inject function instead of constructor injection
 */
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  /**
   * Inject the AuthService using Angular's inject() function
   * This is an alternative to constructor injection available since Angular 14
   */
  private authService = inject(AuthService);
  
  /**
   * Use the auth service's isAuthenticated computed signal directly
   * This will automatically update the UI when auth state changes
   */
  isAuthenticated = this.authService.isAuthenticated;
  
  /**
   * Use the auth service's username computed signal directly
   * This is cleaner than creating our own duplicate signal
   */
  username = this.authService.username;
  
  /**
   * Log out the current user by calling the AuthService
   * The AuthService handles clearing tokens and redirecting
   */
  logout(): void {
    this.authService.logout();
  }
}
