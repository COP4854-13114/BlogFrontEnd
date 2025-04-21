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
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Model properties instead of signals
  blogId: number | null = null;
  title = '';
  content = '';
  loading = false;
  error: string | null = null;

  // Check if user is authenticated
  isAuthenticated = this.authService.isAuthenticated;

  ngOnInit(): void {
    // If user is not authenticated, redirect to login
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Get blog ID from URL parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogId = Number(id);
      this.loadBlog(Number(id));
    } else {
      // If no ID provided, redirect to home
      this.router.navigate(['/']);
    }
  }

  // Load blog details for editing
  loadBlog(id: number): void {
    this.loading = true;
    this.blogService.getBlog(id).subscribe({
      next: (blog: Blog) => {
        this.title = blog.title;
        this.content = blog.content;
        this.loading = false;
        
        // Check if user can edit this blog
        if (!this.blogService.canEdit(blog)) {
          this.snackBar.open('You do not have permission to edit this blog', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error loading blog';
        console.error('Error loading blog:', err);
      }
    });
  }

  // Update an existing blog
  updateBlog(): void {
    if (!this.title || !this.content) {
      this.error = 'Title and content are required';
      return;
    }

    this.loading = true;
    this.error = null;

    const blogData = {
      title: this.title,
      content: this.content
    };

    // Update existing blog
    this.blogService.updateBlog(this.blogId!, blogData).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Blog updated successfully', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error updating blog';
        console.error('Error updating blog:', err);
      }
    });
  }

  // Cancel editing and return to home
  cancel(): void {
    this.router.navigate(['/']);
  }
}
