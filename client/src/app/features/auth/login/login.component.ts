import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputText,
    Password,
    //Button,
    Card
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loginForm;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
   
    if (this.loginForm.invalid) {
      console.log("Form invalid");
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {

        this.authService.saveToken(response.token);

        // Redirect based on role
        const role = this.authService.getUserRole();
        console.log('User role:', role);

        switch (role?.toLowerCase()) {
          case 'admin':
            this.router.navigate(['/admin/products']);
            break;

          case 'user':
            this.router.navigate(['/user/products']);
            break;

          default:
            this.router.navigate(['/login']);
        }

      },
      error: (err: any) => {
        console.error(err);
        alert('Login failed');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}



