import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
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

  // Get all blogs - Returns Promise for easier async/await usage
  async getBlogs(): Promise<Blog[]> {
    try {
      return await lastValueFrom(this.http.get<Blog[]>(`${this.apiUrl}/blogs`));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get a single blog by ID - Returns Promise for easier async/await usage
  async getBlog(id: number): Promise<Blog> {
    try {
      return await lastValueFrom(this.http.get<Blog>(`${this.apiUrl}/blogs/${id}`));
    } catch (error) {
      console.error(`Error fetching blog with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new blog - Returns Promise for easier async/await usage
  async createBlog(blogData: { title: string, content: string }): Promise<Blog> {
    try {
      return await lastValueFrom(
        this.http.post<Blog>(
          `${this.apiUrl}/blogs`, 
          blogData, 
          this.authService.getAuthOptions()
        )
      );
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update an existing blog - Returns Promise for easier async/await usage
  async updateBlog(id: number, blogData: { title: string, content: string }): Promise<Blog> {
    try {
      return await lastValueFrom(
        this.http.put<Blog>(
          `${this.apiUrl}/blogs/${id}`, 
          blogData, 
          this.authService.getAuthOptions()
        )
      );
    } catch (error) {
      console.error(`Error updating blog with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a blog - Returns Promise for easier async/await usage
  async deleteBlog(id: number): Promise<void> {
    try {
      await lastValueFrom(
        this.http.delete<void>(
          `${this.apiUrl}/blogs/${id}`, 
          this.authService.getAuthOptions()
        )
      );
    } catch (error) {
      console.error(`Error deleting blog with ID ${id}:`, error);
      throw error;
    }
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
