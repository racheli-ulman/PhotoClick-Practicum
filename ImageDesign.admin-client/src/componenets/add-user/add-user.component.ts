import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-add-user',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  registerForm: FormGroup;
  error: string = '';
  showPassword: boolean = false;

  constructor(public fb: FormBuilder, public userService: UserService, public router: Router, public dialogRef: MatDialogRef<AddUserComponent>) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // פונקציה לבדיקה אם שדה מסוים נגוע ולא תקין
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  // פונקציה לקבלת הודעת שגיאה מתאימה לשדה
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (!field || !field.errors) return '';
    
    if (field.errors['required']) {
      return 'שדה זה הוא חובה';
    }
    
    if (fieldName === 'email' && field.errors['email']) {
      return 'יש להזין כתובת אימייל תקינה';
    }
    
    return 'שדה לא תקין';
  }

  // סימון כל השדות כנגועים כדי להציג את כל השגיאות
  markAllFieldsAsTouched() {
    Object.keys(this.registerForm.controls).forEach(fieldName => {
      const control = this.registerForm.get(fieldName);
      control?.markAsTouched();
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { firstName, lastName, email, password } = this.registerForm.value;

      const newUser = { firstName, lastName, email, password, role: 'User' };
      this.userService.addUser(newUser).subscribe({
        next: () => {
          this.dialogRef.close('added'); // סגור את הדיאלוג עם תוצאה
        },
        error: (err) => {
          this.error = 'הרשמה נכשלה. אנא נסה שנית.';
          console.error(err);
        }
      });
    } else {
      this.error = 'אנא מלא את כל השדות בצורה תקינה.';
      this.markAllFieldsAsTouched();
    }
  }
}