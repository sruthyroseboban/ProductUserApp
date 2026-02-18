import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '../../../core/services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Password,
    Card,
    RouterModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm;
  loading = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    const { confirmPassword, ...registerData } = this.registerForm.value;

    if (this.registerForm.value.password !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Password Mismatch',
        detail: 'Passwords do not match'
      });
      return;
    }

    this.loading = true;

    const requestData = {
      ...registerData,
      role: 'User'
    };

    this.authService.register(requestData).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful! Please login.',
          life: 3000
        });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: err.error?.message || 'Failed to register. Please try again.',
          life: 5000
        });
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
