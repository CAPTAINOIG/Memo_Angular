import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import Toastify from 'toastify-js';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private local:LocalstorageService,
   private HttpRequest:HttpRequestService,
   private userDetail: ServicesidebarService,
  ) {
    this.loginForm = this.fb.group({
      identity: ['', Validators.required],
      password: ['', Validators.required],
      // rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const json = this.loginForm.value;
      this.HttpRequest.makePostRequest(`/auth/login`, json).subscribe({
        next: (data:any) => {
          this.userDetail.setUserDetail(data)
          this.isLoading = false;
          if (data.status) {
            Toastify({
              text: "Authentication successful!",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "green",
            }).showToast();
          this.local.write("data",  (data.token))
          this.router.navigate(['/auth']);
          }
        },
        error: (err:any) => {
          this.isLoading = false;
          const errMsg = err?.error?.message ?? err.message;
          Toastify({
            text: errMsg,
            duration: 3000,
            gravity: "top", 
            position: "right", 
            backgroundColor: "red",
          }).showToast();
        }
      });
    }
  }
}
