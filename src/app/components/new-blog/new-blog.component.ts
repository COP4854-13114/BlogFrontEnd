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
import { firstValueFrom } from 'rxjs';

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
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  // Model properties instead of signals
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
    }
  }

  // Create a new blog
  async createBlog(): Promise<void> {
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

    try {
      // Create new blog
      await firstValueFrom(this.blogService.createBlog(blogData));
      this.loading = false;
      this.snackBar.open('Blog created successfully', 'Close', {
        duration: 3000
      });
      this.router.navigate(['/']);
    } catch (err) {
      this.loading = false;
      this.error = 'Error creating blog';
      console.error('Error creating blog:', err);
    }
  }

  // Cancel creating and return to home
  cancel(): void {
    this.router.navigate(['/']);
  }
}
