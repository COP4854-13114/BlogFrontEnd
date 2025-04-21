import { Component, OnInit, inject } from '@angular/core';
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
  private blogService = inject(BlogService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  blogs = this.blogService.getblogsSignal();
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.getCurrentUser;

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe({
      error: (err) => {
        console.error('Error loading blogs:', err);
        this.snackBar.open('Error loading blogs', 'Close', {
          duration: 3000
        });
      }
    });
  }

  deleteBlog(blog: Blog): void {
    if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      this.blogService.deleteBlog(blog.id).subscribe({
        next: () => {
          this.snackBar.open('Blog deleted successfully', 'Close', {
            duration: 3000
          });
        },
        error: (err) => {
          console.error('Error deleting blog:', err);
          this.snackBar.open('Error deleting blog', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }

  canEdit(blog: Blog): boolean {
    return this.blogService.canEdit(blog);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
