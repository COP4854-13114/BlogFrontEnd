import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Base URL for the API
  private apiUrl = 'http://localhost:3000';
  
  // Store authentication state in a signal
  private authState = signal<{ token: string | null, username: string | null }>({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username')
  });

  // Computed values based on auth state
  public isAuthenticated = computed(() => !!this.authState().token);
  public username = computed(() => this.authState().username);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Create HttpHeaders with Authorization token if available
  private createAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const token = this.authState().token;
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  // Login user with username and password using Basic Auth
  // Returns a Promise for easier async/await usage
  async login(username: string, password: string): Promise<AuthResponse> {
    // Create Basic Auth header
    const credentials = `${username}:${password}`;
    const base64Credentials = btoa(credentials);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/json'
    });
    
    try {
      // Use lastValueFrom to convert Observable to Promise
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, {}, { headers })
      );
      
      // Store token and username in localStorage and update signal
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', username);
      
      this.authState.set({
        token: response.token,
        username: username
      });
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout user
  logout(): void {
    // Clear localStorage and update signal
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    this.authState.set({
      token: null,
      username: null
    });
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }

  // Get HTTP options with auth headers
  getAuthOptions() {
    return {
      headers: this.createAuthHeaders()
    };
  }
}
