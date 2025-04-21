import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUserSignal = signal<User | null>(null);
  
  // Computed signal to check if user is authenticated
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkToken();
  }

  // Check if a token exists in localStorage and validate it
  private checkToken(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      this.currentUserSignal.set({ username });
    }
  }

  // Login using Basic Auth
  login(username: string, password: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {}, { headers })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', username);
          this.currentUserSignal.set({ username });
        })
      );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.currentUserSignal.set(null);
    this.router.navigate(['/']);
  }

  // Get current user
  getCurrentUser = computed(() => this.currentUserSignal());
}
