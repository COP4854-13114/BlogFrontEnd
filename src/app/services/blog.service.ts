import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  // Base URL for the API
  private apiUrl = 'http://localhost:3000';

  // Get all blogs
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs`);
  }

  // Get a single blog by ID
  getBlog(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blogs/${id}`);
  }

  // Create a new blog
  createBlog(blogData: { title: string, content: string }): Observable<Blog> {
    return this.http.post<Blog>(
      `${this.apiUrl}/blogs`, 
      blogData, 
      this.authService.getAuthOptions()
    );
  }

  // Update an existing blog
  updateBlog(id: number, blogData: { title: string, content: string }): Observable<Blog> {
    return this.http.put<Blog>(
      `${this.apiUrl}/blogs/${id}`, 
      blogData, 
      this.authService.getAuthOptions()
    );
  }

  // Delete a blog
  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/blogs/${id}`, 
      this.authService.getAuthOptions()
    );
  }

  // Check if the current user can edit a blog
  canEdit(blog: Blog): boolean {
    // If not authenticated, cannot edit
    if (!this.authService.isAuthenticated()) {
      return false;
    }
    
    // If user is admin or the creator of the blog, they can edit
    const currentUser = this.authService.username();
    return currentUser === blog.created_by;
  }
}
