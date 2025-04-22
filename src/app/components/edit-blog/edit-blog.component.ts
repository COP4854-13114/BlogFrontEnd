/**
 * Edit Blog Component
 * 
 * This component provides an interface for editing existing blog posts, including:
 * - Loading existing blog data
 * - Validating user permission to edit
 * - Form for editing title and content
 * - Updating blog in the backend
 * 
 * IMPORTANT CONCEPTS:
 * 1. Route Parameters: Extracts blog ID from the URL to determine which blog to edit
 * 
 * 2. Permission Validation: Checks if the current user has permission to edit the blog
 * 
 * 3. Prefilled Form: Loads existing blog data into form fields
 * 
 * 4. Navigation Guards: Redirects unauthorized users
 */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-edit-blog',
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
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css'
})
export class EditBlogComponent implements OnInit {
  /**
   * Inject required services using Angular's inject() function
   */
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  /**
   * Form model properties for two-way binding with the template
   * blogId stores the ID of the blog being edited
   */
  blogId: number | null = null;
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
   * Lifecycle hook that initializes the component:
   * 1. Checks if user is authenticated
   * 2. Extracts blog ID from route parameters
   * 3. Loads blog data for editing
   */
  async ngOnInit(): Promise<void> {
    // If user is not authenticated, redirect to login page
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Extract blog ID from URL parameter
    // In Angular routing, route parameters are accessed via ActivatedRoute
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogId = Number(id);
      await this.loadBlog(Number(id));
    } else {
      // If no ID provided, redirect to home page
      // This prevents access to the edit page without a specific blog to edit
      this.router.navigate(['/']);
    }
  }

  /**
   * Loads blog data from the API and populates the form
   * Also checks if the current user has permission to edit this blog
   * 
   * @param id The ID of the blog to load
   */
  async loadBlog(id: number): Promise<void> {
    this.loading = true;
    
    try {
      // Fetch the blog data from the API
      const blog: Blog = await this.blogService.getBlog(id);
      
      // Populate form fields with existing blog data
      this.title = blog.title;
      this.content = blog.content;
      this.loading = false;
      
      // Check if the current user has permission to edit this blog
      // This prevents users from editing blogs they don't own
      if (!this.blogService.canEdit(blog)) {
        this.snackBar.open('You do not have permission to edit this blog', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/']);
      }
    } catch (err) {
      this.loading = false;
      this.error = 'Error loading blog';
      console.error('Error loading blog:', err);
    }
  }

  /**
   * Updates an existing blog with the new title and content
   * Validates inputs before submitting
   */
  async updateBlog(): Promise<void> {
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
      // Call the BlogService to update the blog
      // The non-null assertion (!) tells TypeScript that blogId is definitely not null
      await this.blogService.updateBlog(this.blogId!, blogData);
      
      // Update UI after successful update
      this.loading = false;
      
      // Show success notification
      this.snackBar.open('Blog updated successfully', 'Close', {
        duration: 3000
      });
      
      // Navigate back to home page to see the updated blog
      this.router.navigate(['/']);
    } catch (err) {
      // Handle error case
      this.loading = false;
      this.error = 'Error updating blog';
      console.error('Error updating blog:', err);
    }
  }

  /**
   * Cancels editing and returns to home page
   * No confirmation is requested as the user might want to discard changes
   */
  cancel(): void {
    this.router.navigate(['/']);
  }
}
