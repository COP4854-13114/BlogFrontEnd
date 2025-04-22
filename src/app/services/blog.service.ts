/**
 * Blog Service
 * 
 * This service handles all blog-related API operations including:
 * - Fetching all blogs or a single blog
 * - Creating new blogs
 * - Updating existing blogs
 * - Deleting blogs
 * - Checking edit permissions
 * 
 * IMPORTANT CONCEPTS:
 * 1. Promise-based API: Using lastValueFrom to convert Observables to Promises
 *    for easier async/await usage in components
 * 
 * 2. Error handling: All API calls are wrapped in try/catch blocks
 *    to provide consistent error handling
 * 
 * 3. Authentication: Protected routes (create, update, delete) include auth headers
 * 
 * 4. Permission checking: Ensuring users can only edit their own content
 */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Blog } from '../models/blog.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  /**
   * Using Angular's inject function for dependency injection
   * This is an alternative to constructor injection available since Angular 14+
   */
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  /**
   * Base URL for the blog API
   * In a real application, this would be configured from environment variables
   */
  private apiUrl = 'http://localhost:3000';

  /**
   * Retrieves all blogs from the API
   * 
   * @returns Promise that resolves to an array of Blog objects
   * @throws Error if the API call fails
   */
  async getBlogs(): Promise<Blog[]> {
    try {
      // Using lastValueFrom to convert Observable to Promise
      // This endpoint is public, so no auth headers needed
      return await lastValueFrom(this.http.get<Blog[]>(`${this.apiUrl}/blogs`));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error; // Re-throw for component-level handling
    }
  }

  /**
   * Retrieves a single blog by its ID
   * 
   * @param id The unique identifier of the blog to retrieve
   * @returns Promise that resolves to a Blog object
   * @throws Error if the API call fails or blog doesn't exist
   */
  async getBlog(id: number): Promise<Blog> {
    try {
      // This endpoint is public, so no auth headers needed
      return await lastValueFrom(this.http.get<Blog>(`${this.apiUrl}/blogs/${id}`));
    } catch (error) {
      console.error(`Error fetching blog with ID ${id}:`, error);
      throw error; // Re-throw for component-level handling
    }
  }

  /**
   * Creates a new blog post
   * Requires authentication, so auth headers are included
   * 
   * @param blogData Object containing the title and content of the new blog
   * @returns Promise that resolves to the created Blog including server-generated fields
   * @throws Error if the API call fails or user is not authenticated
   */
  async createBlog(blogData: { title: string, content: string }): Promise<Blog> {
    try {
      // This endpoint requires authentication, so we include auth headers
      return await lastValueFrom(
        this.http.post<Blog>(
          `${this.apiUrl}/blogs`, 
          blogData, 
          this.authService.getAuthOptions() // Include auth headers
        )
      );
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error; // Re-throw for component-level handling
    }
  }

  /**
   * Updates an existing blog post
   * Requires authentication, so auth headers are included
   * 
   * @param id The unique identifier of the blog to update
   * @param blogData Object containing the updated title and content
   * @returns Promise that resolves to the updated Blog
   * @throws Error if the API call fails, blog doesn't exist, or user lacks permission
   */
  async updateBlog(id: number, blogData: { title: string, content: string }): Promise<Blog> {
    try {
      // This endpoint requires authentication, so we include auth headers
      return await lastValueFrom(
        this.http.put<Blog>(
          `${this.apiUrl}/blogs/${id}`, 
          blogData, 
          this.authService.getAuthOptions() // Include auth headers
        )
      );
    } catch (error) {
      console.error(`Error updating blog with ID ${id}:`, error);
      throw error; // Re-throw for component-level handling
    }
  }

  /**
   * Deletes a blog post
   * Requires authentication, so auth headers are included
   * 
   * @param id The unique identifier of the blog to delete
   * @returns Promise that resolves when deletion is complete
   * @throws Error if the API call fails, blog doesn't exist, or user lacks permission
   */
  async deleteBlog(id: number): Promise<void> {
    try {
      // This endpoint requires authentication, so we include auth headers
      await lastValueFrom(
        this.http.delete<void>(
          `${this.apiUrl}/blogs/${id}`, 
          this.authService.getAuthOptions() // Include auth headers
        )
      );
    } catch (error) {
      console.error(`Error deleting blog with ID ${id}:`, error);
      throw error; // Re-throw for component-level handling
    }
  }

  /**
   * Checks if the current user has permission to edit a specific blog
   * A user can only edit blogs they created
   * 
   * @param blog The blog object to check for edit permission
   * @returns boolean indicating whether current user can edit the blog
   */
  canEdit(blog: Blog): boolean {
    // If not authenticated, cannot edit any blog
    if (!this.authService.isAuthenticated()) {
      return false;
    }
    
    // A user can only edit blogs they created
    // In a real app, you might have admin roles or more complex permission logic
    const currentUser = this.authService.username();
    return currentUser === blog.created_by;
  }
}
