import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth.service';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AppLayoutComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  role = '';
  totalUsers = 0;
  totalProducts = 0;

  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    // this.role = this.auth.getUserRole() ?? '';
  }

  ngOnInit(): void {

    this.dashboardService.getAllUsers().subscribe({
      next: (users: string | any[]) => {
        this.totalUsers = users.length;
      },
      error: (err: any) => console.error(err)
    });

    this.dashboardService.getAllProducts().subscribe({
      next: (products: string | any[]) => {
        this.totalProducts = products.length;
      },
      error: (err: any) => console.error(err)
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
