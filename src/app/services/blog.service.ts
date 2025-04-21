import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Blog } from '../models/blog.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000/blogs';
  private blogsSignal = signal<Blog[]>([]);

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get all blogs and update the signal
  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl).pipe(
      map(blogs => blogs.map(blog => ({
        ...blog,
        date: new Date(blog.date)
      }))),
      tap(blogs => this.blogsSignal.set(blogs))
    );
  }

  // Get a single blog by id
  getBlog(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`).pipe(
      map(blog => ({
        ...blog,
        date: new Date(blog.date)
      }))
    );
  }

  // Create a new blog
  createBlog(blog: { title: string, content: string }): Observable<Blog> {
    return this.http.post<Blog>(this.apiUrl, blog).pipe(
      map(blog => ({
        ...blog,
        date: new Date(blog.date)
      })),
      tap(newBlog => {
        const currentBlogs = this.blogsSignal();
        this.blogsSignal.set([...currentBlogs, newBlog]);
      })
    );
  }

  // Update an existing blog
  updateBlog(id: number, blog: { title: string, content: string }): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, blog).pipe(
      map(blog => ({
        ...blog,
        date: new Date(blog.date)
      })),
      tap(updatedBlog => {
        const currentBlogs = this.blogsSignal();
        const updatedBlogs = currentBlogs.map(b => 
          b.id === updatedBlog.id ? updatedBlog : b
        );
        this.blogsSignal.set(updatedBlogs);
      })
    );
  }

  // Delete a blog
  deleteBlog(id: number): Observable<Blog> {
    return this.http.delete<Blog>(`${this.apiUrl}/${id}`).pipe(
      tap(deletedBlog => {
        const currentBlogs = this.blogsSignal();
        this.blogsSignal.set(currentBlogs.filter(blog => blog.id !== id));
      })
    );
  }

  // Current user can edit a blog if they are the author
  canEdit(blog: Blog): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.username === blog.created_by;
  }

  // Get the current blogs signal for components to subscribe to
  getblogsSignal() {
    return this.blogsSignal;
  }
}
