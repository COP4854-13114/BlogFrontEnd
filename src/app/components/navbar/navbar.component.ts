import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  
  // Use the auth service's signal
  isAuthenticated = this.authService.isAuthenticated;
  username = signal('');
  
  constructor() {
    this.updateUsername();
  }
  
  updateUsername(): void {
    if (this.isAuthenticated()) {
      this.username.set(this.authService.getCurrentUser()?.username || '');
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}
