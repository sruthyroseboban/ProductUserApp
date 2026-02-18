import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { UserService, User, PagedResult } from '../../../core/services/user.service';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AppLayoutComponent, 
    CardModule, 
    InputTextModule, 
    ButtonModule, 
    TableModule, 
    SelectModule, 
    ConfirmDialogModule,
    ToastModule,
    Password
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchValue: string = '';
  selectedUser: User = { id: 0, userName: '', email: '', role: 'User' };
  userPassword: string = ''; // Separate field for password
  isEditMode = false;
  loading = false;
  saving = false;
  roleOptions = [
    { label: 'User', value: 'User' },
    { label: 'Admin', value: 'Admin' }
  ];

  totalRecords: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(
    private userService: UserService, 
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

    ngOnInit(): void {
      this.loadUsers();
    }     

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers(this.pageNumber, this.pageSize).subscribe({
      next: (data: PagedResult<User>) => {
        this.users = data.items;
        this.totalRecords = data.totalCount;
        this.loading = false;
        // Manually trigger change detection to update the table immediately
        this.cdr.detectChanges();

        // Reapply search filter if active
        if (this.searchValue) {
          this.onSearch();
        } else {
          this.filteredUsers = data.items;
        }
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  onPageChange(event: any): void {
    const newPageNumber = Math.floor(event.first / event.rows) + 1;
    const newPageSize = event.rows;

    if (newPageNumber !== this.pageNumber || newPageSize !== this.pageSize) {
      this.pageNumber = newPageNumber;
      this.pageSize = newPageSize;
      this.loadUsers();
    }
  }

  saveUser() {
    // Validate required fields
    if (!this.selectedUser.userName || !this.selectedUser.email || !this.selectedUser.role) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
      return;
    }

    // Password is required only for creating new users
    if (!this.isEditMode && !this.userPassword) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Password is required for new users'
      });
      return;
    }

    // Validate password strength for new users
    if (!this.isEditMode && this.userPassword.length < 6) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Password must be at least 6 characters long'
      });
      return;
    }

    this.saving = true;

    if (this.isEditMode && this.selectedUser.id) {
      // Update existing user (without password)
      this.userService.updateUser(this.selectedUser.id, this.selectedUser)
        .subscribe({
          next: () => {
            this.saving = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User updated successfully'
            });
            this.resetForm();
            setTimeout(() => {
              this.loadUsers();
            }, 100);
          },
          error: (err) => {
            this.saving = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to update user'
            });
          }
        });
    } else {
      // Create new user (with password)
      const createUserData = {
        ...this.selectedUser,
        password: this.userPassword
      };

      this.userService.createUser(createUserData)
        .subscribe({
          next: () => {
            this.saving = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User created successfully'
            });
            this.resetForm();
            setTimeout(() => {
              this.loadUsers();
            }, 100);
          },
          error: (err) => {
            this.saving = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to create user'
            });
          }
        });
    }
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.userPassword = ''; // Clear password when editing
    this.isEditMode = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteUser(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully'
            });
            this.loadUsers();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to delete user'
            });
          }
        });
      }
    });
  }

  resetForm() {
    this.selectedUser = { id: 0, userName: '', email: '', role: 'User' };
    this.userPassword = '';
    this.isEditMode = false;
  }

  onSearch() {
    if (!this.searchValue) {
      this.filteredUsers = this.users;
      return;
    }

    const searchLower = this.searchValue.toLowerCase();
    this.filteredUsers = this.users.filter((user: User) => 
      user.userName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }

  clearSearch() {
    this.searchValue = '';
    this.filteredUsers = this.users;
  }
}
