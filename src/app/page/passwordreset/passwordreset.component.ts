import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Toastify from 'toastify-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-passwordreset',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './passwordreset.component.html',
    styleUrl: './passwordreset.component.css'
})
export class PasswordresetComponent implements OnInit {
  resetPassword: FormGroup;
  isLoading = false;
  token: string;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.token = JSON.parse(localStorage.getItem('passwordToken'))
    
    this.resetPassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null : { passwordMismatch: true };
  }
  onSubmit(): void {
    if (this.resetPassword.errors?.passwordMismatch) {
      Toastify({
        text: 'Passwords do not match.',
        backgroundColor: 'red',
        gravity: 'top',
        position: 'right',
        duration: 3000,
      }).showToast();
      return;
    }
if (this.resetPassword.valid) {
    this.isLoading = true;
    const data = this.resetPassword.value;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": '69420',
    });

   
    this.http.patch('https://lendnode.creditclan.com/memo/api/auth/reset_password', {password:data.password}, {headers}).subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        Toastify({
          text: 'Password reset request submitted successfully!',
          backgroundColor: 'blue',
          gravity: 'top',
          position: 'right',
          duration: 3000,
        }).showToast();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
        Toastify({
          text: 'An error occurred. Please try again.',
          backgroundColor: 'red',
          gravity: 'top',
          position: 'right',
          duration: 3000,
        }).showToast();
      }
    );
  }
}
}


