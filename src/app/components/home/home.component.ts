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
import { firstValueFrom } from 'rxjs';

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

  // Create a signal to store blogs
  blogs = signal<Blog[]>([]);
  isAuthenticated = this.authService.isAuthenticated;
  
  async ngOnInit(): Promise<void> {
    await this.loadBlogs();
  }

  async loadBlogs(): Promise<void> {
    try {
      const data = await firstValueFrom(this.blogService.getBlogs());
      this.blogs.set(data);
    } catch (err) {
      console.error('Error loading blogs:', err);
      this.snackBar.open('Error loading blogs', 'Close', {
        duration: 3000
      });
    }
  }

  async deleteBlog(blog: Blog): Promise<void> {
    if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await firstValueFrom(this.blogService.deleteBlog(blog.id));
        
        // Update the blogs list after deletion
        await this.loadBlogs();
        
        this.snackBar.open('Blog deleted successfully', 'Close', {
          duration: 3000
        });
      } catch (err) {
        console.error('Error deleting blog:', err);
        this.snackBar.open('Error deleting blog', 'Close', {
          duration: 3000
        });
      }
    }
  }

  canEdit(blog: Blog): boolean {
    return this.blogService.canEdit(blog);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
