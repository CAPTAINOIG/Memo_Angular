import { Component } from '@angular/core';
import { Validators } from 'ngx-editor';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})
export class ForgotpasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private local:LocalstorageService,
   private httpRequest:HttpRequestService,

  ) {
    this.forgotPasswordForm = this.fb.group({
      identity: ['', Validators.required],
      
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.isLoading = true;
    const data = this.forgotPasswordForm.value;
    this.httpRequest.makePostRequest('/auth/forgot_password', data).subscribe(
      (response) => {
        Toastify({
          text: 'success',
          backgroundColor: 'blue',
          gravity: 'top',
          position: 'right',
          duration: 3000,
        }).showToast();

        this.local.write("passwordToken", (response.token))
        this.router.navigate(['/passwordAuth'])
        this.forgotPasswordForm.reset();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        Toastify({
          text: `${error.error.message}`,
          backgroundColor: 'red',
          gravity: 'top',
          position: 'right',
          duration: 3000,
        }).showToast();
      }
    );
  }
}
