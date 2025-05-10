import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  imports: [ReactiveFormsModule,CommonModule ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  registerForm: FormGroup;
  error: string = '';
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
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
    
    // if (fieldName === 'password' && field.errors['minlength']) {
    //   return 'הסיסמה חייבת להכיל לפחות 6 תווים';
    // }
    
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
          this.router.navigate(['/home/show-users']);
        },
        error: (err) => {
          this.error = 'הרשמה נכשלה. אנא נסה שנית.';
          console.error(err);
        }
      });
    } else {
      this.error = 'אנא מלא את כל השדות בצורה תקינה.';
      this.markAllFieldsAsTouched(); // מסמן את כל השדות כנגועים להצגת שגיאות
    }
  }
}