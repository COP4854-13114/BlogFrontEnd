/**
 * Login Component
 * 
 * This component provides the user login functionality, including:
 * - Username and password input fields
 * - Form validation
 * - Error handling and display
 * - Loading indicator
 * - Password visibility toggle
 * 
 * IMPORTANT CONCEPTS:
 * 1. Standalone Component: Uses Angular's standalone component pattern
 * 
 * 2. Template-driven Forms: Uses NgModel for two-way data binding
 * 
 * 3. Async/Await: Uses modern async/await pattern for API calls
 * 
 * 4. Navigation Guards: Redirects authenticated users away from login page
 * 
 * 5. Material Design: Leverages Angular Material components for UI
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  /**
   * Inject required services using Angular's inject() function
   * This approach is available since Angular 14
   */
  private authService = inject(AuthService);
  private router = inject(Router);
  
  /**
   * Form model properties
   * Using simple properties instead of signals since they're only needed for
   * template form binding and don't need to be reactive outside this component
   */
  username = '';
  password = '';
  loading = false;
  error: string | null = null;
  
  /**
   * Flag to toggle password visibility
   * Provides better UX by allowing users to see what they're typing
   */
  hidePassword = true;
  
  /**
   * Lifecycle hook that runs when the component initializes
   * Redirects already authenticated users to the home page
   */
  ngOnInit(): void {
    // If already authenticated, redirect to home
    // This functions as a simple navigation guard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
  
  /**
   * Handles the login form submission
   * Validates inputs, displays errors, and manages loading state
   */
  async login(): Promise<void> {
    // Basic form validation
    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }
    
    // Show loading spinner and clear any previous errors
    this.loading = true;
    this.error = null;
    
    try {
      // Call the AuthService login method using async/await
      // This simplifies error handling compared to Observable subscriptions
      await this.authService.login(this.username, this.password);
      this.loading = false;
      
      // Redirect to home page on successful login
      this.router.navigate(['/']);
    } catch (err) {
      // Handle login failure
      this.loading = false;
      this.error = 'Invalid username or password';
      console.error('Login error:', err);
    }
  }
}
