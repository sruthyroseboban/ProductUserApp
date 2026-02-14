import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent {
  role: string | null = '';
  constructor(private authService: AuthService, private router: Router) {
    this.role = this.authService.getUserRole();
}

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
