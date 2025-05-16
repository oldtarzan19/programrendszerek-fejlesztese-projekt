import { Component, OnInit }     from '@angular/core';
import { CommonModule }          from '@angular/common';
import { MatTableModule }        from '@angular/material/table';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';
import { MatTableDataSource }    from '@angular/material/table';

import { User, UserService }     from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns = ['username', 'email', 'role', 'isSuspended', 'actions'];
  error?: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: users => {
        this.dataSource.data = users;
      },
      error: () => this.error = 'Could not load users'
    });
  }

  suspend(user: User): void {
    this.userService.suspend(user._id).subscribe({
      next: updated => {
        this.loadUsers();
      },
      error: () => this.error = 'Suspend failed'
    });
  }

  unsuspend(user: User): void {
    this.userService.unsuspend(user._id).subscribe({
      next: updated => {
        this.loadUsers();
      },
      error: () => this.error = 'Unsuspend failed'
    });
  }

  delete(user: User): void {
    this.userService.delete(user._id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: () => this.error = 'Delete failed'
    });
  }
}
