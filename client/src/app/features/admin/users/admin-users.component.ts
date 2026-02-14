import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppLayoutComponent } from '../../../core/layout/app-layout.component';
import { UserService, User } from '../../../core/services/user.service';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AppLayoutComponent, CardModule, InputTextModule, ButtonModule, TableModule, SelectModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users$: Observable<User[]> | undefined;
  // users$: User[] = [];
  selectedUser: User = { id: 0, userName: '', email: '', role: 'User' };
  isEditMode = false;
  loading = false;
  roleOptions = [
    { label: 'User', value: 'User' },
    { label: 'Admin', value: 'Admin' }
  ];
  constructor(private userService: UserService, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
      this.loadUsers();
    }     
  
  // ngAfterViewInit(): void {
  //   this.loadUsers();  
  // }
  
  loadUsers() {
    this.users$ = this.userService.getAllUsers().pipe(
      tap(data => console.log('Users loaded:', data))
    );
  }

  // CREATE OR UPDATE
  saveUser() {
    if (this.isEditMode && this.selectedUser.id) {
      this.userService.updateUser(this.selectedUser.id, this.selectedUser)
        .subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
    } else {
      this.userService.createUser(this.selectedUser)
        .subscribe(() => {
          this.loadUsers();
          this.resetForm();
        });
    }
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditMode = true;
  }

  deleteUser(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(id).subscribe(() => {
          this.loadUsers();
        });
      }
    });
  }

  resetForm() {
    this.selectedUser = { id: 0, userName: '', email: '', role: 'User' };
    this.isEditMode = false;
  }
}
