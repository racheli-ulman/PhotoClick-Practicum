import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-show-users',
  imports: [CommonModule],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.css'
})
export class ShowUsersComponent {
  users: any[] = [];
  errorMessage: string = '';
  canEditUsers: boolean = true; // משתנה לשליטה על הצגת כפתור עריכה
  
  // משתנים לעימוד (pagination)
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  pages: number[] = [];

  constructor(private userService: UserService, private router: Router,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    console.log("טוען משתמשים...");
    
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.totalItems = data.length;
        this.calculatePages();
      },
      error: (error) => {
        this.errorMessage = 'שגיאה בטעינת רשימת המשתמשים';
        console.error(error);
      }
    });
  }

  calculatePages(): void {
    const pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    this.currentPage = page;
    // כאן אפשר להוסיף לוגיקה שתטען רק את המשתמשים לפי העמוד הנוכחי
  }

  delete(id: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      this.userService.deleteUser(id.toString()).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id != id);
          this.totalItems = this.users.length;
          this.calculatePages();
        },
        error: (error) => {
          this.errorMessage = 'שגיאה במחיקת המשתמש';
          console.error(error);
        }
      });
    }
  }

  editUser(id: number): void {
    this.router.navigate(['/edit-user', id]);
  }
}