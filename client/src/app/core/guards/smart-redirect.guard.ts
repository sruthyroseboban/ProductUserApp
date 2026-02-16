import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Smart redirect guard for unknown routes
 * If user is logged in: redirect to appropriate products page based on role
 * If user is not logged in: redirect to login page
 */
export const smartRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    const role = authService.getUserRole();
    
    console.log('User is authenticated with role:', role);
    
    // Redirect based on role
    if (role === 'Admin') {
      console.log('Redirecting admin to /admin/products');
      router.navigate(['/admin/products']);
    } else {
      console.log('Redirecting user to /user/products');
      router.navigate(['/user/products']);
    }
  } else {
    console.log('User not authenticated, redirecting to login');
    router.navigate(['/login']);
  }

  return false; // Prevent the unknown route from activating
};
