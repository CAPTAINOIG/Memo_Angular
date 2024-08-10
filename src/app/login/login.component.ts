import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../service/LocalstorageService/localstorage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  private baseUrl = 'https://5177-102-89-44-97.ngrok-free.app/api/auth';
  //  private baseUrl = 'https://5177-102-89-44-97.ngrok-free.app/api'; 
  //  https://ddb1-102-88-36-173.ngrok-free.app/api/auth/login
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private localStorg:LocalstorageService
  ) {
    this.loginForm = this.fb.group({
      identity: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const json = this.loginForm.value;
      // console.log(json);
      
      this.http.post<any>(`${this.baseUrl}/login`, json).subscribe({
        next: (data:any) => {
        // next: (data) => {
          this.isLoading = false;
          if (data.status) {
          // console.log(data)
          this.localStorg.write("auth-token", { token: data.token })
          this.router.navigate(['/portal/dashboard']);
          }
        },
        error: (err:any) => {
          this.isLoading = false;
          const errMsg = err?.error?.message ?? err.message;
          console.log(err);
        }
      });
    }
  }
}
