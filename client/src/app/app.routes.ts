import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { UserDashboardComponent } from './features/user/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';

import { AdminUsersComponent } from './features/admin/users/admin-users.component';
import { AdminProductsComponent } from './features/admin/products/admin-products.component';
import { UserProductsComponent } from './features/user/products/user-products.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'user-dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'User' },
    component: UserDashboardComponent
  },
  {
    path: 'admin-dashboard',
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin' },
    component: AdminDashboardComponent
  },

  // ADMIN
  { path: 'admin/products', component: AdminProductsComponent },
  { path: 'admin/users', component: AdminUsersComponent },

  // USER
  { path: 'user/products', component: UserProductsComponent },

  { path: '**', redirectTo: 'login' }
];

