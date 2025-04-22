/**
 * New Blog Component
 * 
 * This component provides a form for creating new blog posts, including:
 * - Title and content input fields
 * - Form validation
 * - Error handling and display
 * - Loading indicator
 * - Create and cancel actions
 * 
 * IMPORTANT CONCEPTS:
 * 1. Authentication Check: Redirects unauthenticated users to login
 * 
 * 2. Template-driven Forms: Uses NgModel for two-way data binding
 * 
 * 3. Error Handling: Shows user-friendly error messages
 * 
 * 4. Loading States: Provides visual feedback during API calls
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-blog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './new-blog.component.html',
  styleUrl: './new-blog.component.css'
})
export class NewBlogComponent {
  /**
   * Inject required services using Angular's inject() function
   */
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  /**
   * Form model properties for two-way binding with the template
   * Using simple properties instead of signals for form state
   */
  title = '';
  content = '';
  loading = false;
  error: string | null = null;

  /**
   * Reference to AuthService's isAuthenticated computed signal
   * Used to check authentication status
   */
  isAuthenticated = this.authService.isAuthenticated;

  /**
   * Lifecycle hook that redirects unauthenticated users
   * Acts as a simple route guard to protect this component
   */
  ngOnInit(): void {
    // If user is not authenticated, redirect to login page
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Creates a new blog post with the provided title and content
   * Validates inputs, handles API interactions, and manages UI state
   */
  async createBlog(): Promise<void> {
    // Basic form validation
    if (!this.title || !this.content) {
      this.error = 'Title and content are required';
      return;
    }

    // Update UI to show loading state
    this.loading = true;
    this.error = null;

    // Prepare data for API call
    const blogData = {
      title: this.title,
      content: this.content
    };

    try {
      // Create new blog using BlogService
      await this.blogService.createBlog(blogData);
      
      // Update UI after successful creation
      this.loading = false;
      
      // Show success notification
      this.snackBar.open('Blog created successfully', 'Close', {
        duration: 3000
      });
      
      // Navigate back to home page to see the new blog
      this.router.navigate(['/']);
    } catch (err) {
      // Handle error case
      this.loading = false;
      this.error = 'Error creating blog';
      console.error('Error creating blog:', err);
    }
  }

  /**
   * Cancels blog creation and returns to home page
   * No confirmation is requested as no persistent changes have been made
   */
  cancel(): void {
    this.router.navigate(['/']);
  }
}
