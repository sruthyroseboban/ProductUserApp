import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [AppLayoutComponent, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
  role = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardService: DashboardService
  ) {
    this.role = this.auth.getUserRole() ?? '';
  }

  myProducts: any[] = [];

  ngOnInit(): void {
    this.dashboardService.getMyProducts().subscribe(products => {
      this.myProducts = products;
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
