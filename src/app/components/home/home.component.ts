/**
 * Home Component
 * 
 * This component serves as the main landing page of the application, displaying:
 * - List of all blog posts
 * - Options to create, edit, or delete blogs (when authenticated)
 * - Blog metadata (titles, dates, authors)
 * 
 * IMPORTANT CONCEPTS:
 * 1. Signals: Uses Angular's signals API for reactive state management
 * 
 * 2. Component Lifecycle: Implements OnInit for initialization logic
 * 
 * 3. Async/Await: Uses modern async/await pattern for API calls
 * 
 * 4. Conditional UI: Shows different options based on authentication status
 * 
 * 5. Material Design: Uses Angular Material components for consistent UI
 */
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  /**
   * Inject required services using Angular's inject() function
   */
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  /**
   * Signal to store and reactively update the list of blogs
   * Using signals provides automatic change detection and efficient updates
   */
  blogs = signal<Blog[]>([]);
  
  /**
   * Reference to AuthService's isAuthenticated signal
   * This reactively updates the UI when auth state changes
   */
  isAuthenticated = this.authService.isAuthenticated;
  
  /**
   * Lifecycle hook that loads blogs when component initializes
   */
  async ngOnInit(): Promise<void> {
    await this.loadBlogs();
  }

  /**
   * Fetches all blogs from the API and updates the blogs signal
   * Can be called multiple times to refresh the blog list
   */
  async loadBlogs(): Promise<void> {
    try {
      // Using async/await with BlogService for cleaner code
      const data = await this.blogService.getBlogs();
      
      // Update the blogs signal with new data
      // This will trigger UI updates in any template expressions using blogs()
      this.blogs.set(data);
    } catch (err) {
      console.error('Error loading blogs:', err);
      
      // Show user-friendly error notification
      this.snackBar.open('Error loading blogs', 'Close', {
        duration: 3000
      });
    }
  }

  /**
   * Deletes a blog post after confirmation
   * 
   * @param blog The blog to delete
   */
  async deleteBlog(blog: Blog): Promise<void> {
    // Ask for confirmation before deleting
    if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        // Call the blog service to delete the blog
        await this.blogService.deleteBlog(blog.id);
        
        // Refresh the blogs list after successful deletion
        await this.loadBlogs();
        
        // Show success notification
        this.snackBar.open('Blog deleted successfully', 'Close', {
          duration: 3000
        });
      } catch (err) {
        console.error('Error deleting blog:', err);
        
        // Show error notification
        this.snackBar.open('Error deleting blog', 'Close', {
          duration: 3000
        });
      }
    }
  }

  /**
   * Checks if the current user can edit a specific blog
   * Used to conditionally show edit/delete buttons
   * 
   * @param blog The blog to check for edit permission
   * @returns boolean indicating whether current user can edit the blog
   */
  canEdit(blog: Blog): boolean {
    return this.blogService.canEdit(blog);
  }

  /**
   * Formats a date into a localized string
   * 
   * @param date The date to format
   * @returns Formatted date string
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
