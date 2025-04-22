import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  // Model properties instead of signals
  username = '';
  password = '';
  loading = false;
  error: string | null = null;
  
  // Property to toggle password visibility
  hidePassword = true;
  
  ngOnInit(): void {
    // If already authenticated, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
  
  // Perform login
  async login(): Promise<void> {
    if (!this.username || !this.password) {
      this.error = 'Username and password are required';
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    try {
      // Now using async/await directly with the updated AuthService
      await this.authService.login(this.username, this.password);
      this.loading = false;
      this.router.navigate(['/']);
    } catch (err) {
      this.loading = false;
      this.error = 'Invalid username or password';
      console.error('Login error:', err);
    }
  }
}
