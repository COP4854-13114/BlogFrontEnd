/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations including:
 * - Login/logout functionality
 * - Token management
 * - Authentication state tracking
 * - Header creation for authenticated requests
 * 
 * IMPORTANT CONCEPTS:
 * 1. Signal-based state management: Angular 16+ signals provide reactive state
 *    that components can subscribe to. This replaces traditional BehaviorSubject approach.
 * 
 * 2. Computed values: Derived state that automatically updates when dependencies change
 * 
 * 3. Token-based authentication: JWT tokens stored in localStorage
 *    Note: For production, consider more secure storage mechanisms and CSRF protection
 * 
 * 4. Promise-based API: Using lastValueFrom to convert Observables to Promises
 *    for easier async/await usage
 */
import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Base URL for the authentication API
   * In a real application, this would be configured from environment variables
   */
  private apiUrl = 'http://localhost:3000';
  
  /**
   * Authentication state stored as a signal
   * Signals provide a reactive way to manage state in Angular 16+
   * Initial value is loaded from localStorage to persist across page refreshes
   */
  private authState = signal<{ token: string | null, username: string | null }>({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username')
  });

  /**
   * Computed values derived from authState
   * These automatically update when authState changes
   * Public properties that components can use without direct access to authState
   */
  public isAuthenticated = computed(() => !!this.authState().token);
  public username = computed(() => this.authState().username);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Creates HTTP headers with authentication token if available
   * Used to authenticate API requests
   * 
   * @returns HttpHeaders object with appropriate Authorization header
   */
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

  /**
   * Authenticates a user with username and password using Basic Auth
   * On success, stores the token and username in localStorage and updates authState
   * 
   * @param username The user's username
   * @param password The user's password
   * @returns Promise that resolves to AuthResponse containing JWT token
   * @throws Error if authentication fails
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    // Create Basic Auth header
    // Basic Auth sends credentials as base64 encoded "username:password" string
    const credentials = `${username}:${password}`;
    const base64Credentials = btoa(credentials);
    const headers = new HttpHeaders({
      'Authorization': `Basic ${base64Credentials}`,
      'Content-Type': 'application/json'
    });
    
    try {
      // Use lastValueFrom to convert Observable to Promise for easier async/await usage
      // This is the modern approach since RxJS 7+ for converting Observables to Promises
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(`${this.apiUrl}/login`, {}, { headers })
      );
      
      // Store token and username in localStorage for persistence across page refreshes
      // Note: For production apps, consider more secure storage options
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', username);
      
      // Update the authentication state signal with new values
      // This will automatically update all computed values and notify components
      this.authState.set({
        token: response.token,
        username: username
      });
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to let components handle the error
    }
  }

  /**
   * Logs out the current user
   * Clears localStorage, resets authentication state, and redirects to login page
   */
  logout(): void {
    // Clear localStorage and update signal
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Reset the authentication state
    this.authState.set({
      token: null,
      username: null
    });
    
    // Redirect to login page
    this.router.navigate(['/login']);
  }

  /**
   * Returns HTTP options with authentication headers
   * Used by other services when making authenticated API requests
   * 
   * @returns Object containing headers for authenticated requests
   */
  getAuthOptions() {
    return {
      headers: this.createAuthHeaders()
    };
  }
}
