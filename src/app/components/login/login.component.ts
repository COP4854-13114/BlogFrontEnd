import { Component, inject, signal } from '@angular/core';
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
  
  // Signals for the component state
  username = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  
  // Property to toggle password visibility
  hidePassword = true;
  
  ngOnInit(): void {
    // If already authenticated, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }
  
  // Update username signal
  updateUsername(event: Event): void {
    this.username.set((event.target as HTMLInputElement).value);
  }
  
  // Update password signal
  updatePassword(event: Event): void {
    this.password.set((event.target as HTMLInputElement).value);
  }
  
  // Perform login
  login(): void {
    if (!this.username() || !this.password()) {
      this.error.set('Username and password are required');
      return;
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    this.authService.login(this.username(), this.password())
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set('Invalid username or password');
          console.error('Login error:', err);
        }
      });
  }
}
