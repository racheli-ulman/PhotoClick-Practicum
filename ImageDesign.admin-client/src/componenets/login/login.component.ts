import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'; // הוסף את השורה הזו
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,MatIconModule,
    MatCardModule,  MatError,
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      MatCheckboxModule,
      MatIconModule,
      MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  addUserForm!: FormGroup;
  errormessage: string = '';
  showError: boolean = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      const { email, password } = this.addUserForm.value;

      this.authservice.login(email, password).subscribe({
        next: (response) => {
          console.log('User logged in successfully', response);
          sessionStorage.setItem('token', response.token);
          console.log("token", response.token);
          sessionStorage.setItem('userId', response.user.id);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          if (err.status === 400) {
            this.errormessage = 'פרטי התחברות שגויים';
          } else if (err.status === 401) {
            this.errormessage = 'רק מנהל יכול להתחבר';
          } else {
            console.log("err.status", err.status);
            this.errormessage = 'אירעה שגיאה בלתי צפויה';
          }
          this.showError = true;
        }
      });
    } else {
      this.errormessage = 'נא למלא את כל השדות בצורה נכונה';
      this.showError = true;
    }
  }
}