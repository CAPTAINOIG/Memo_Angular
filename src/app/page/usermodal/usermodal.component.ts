import { CommonModule } from '@angular/common';
import { HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import { Router } from '@angular/router';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"; 

@Component({
  selector: 'app-usermodal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usermodal.component.html',
  styleUrls: ['./usermodal.component.css']  // Corrected to styleUrls
})
export class UsermodalComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private local: LocalstorageService,
    private httpRequest: HttpRequestService 
  ) {  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],  // Added email validator
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],  // Example phone number 
      role_id: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {  // Ensures the form is valid before submission
      this.isLoading = true;
      const data = this.loginForm.value;
      console.log(data);

      this.httpRequest.makePostRequest('users_management/create_new_user', data).subscribe(
        (response) => {
          console.log(response);
          this.isLoading = false;

          if (response.status) {
            Toastify({
              text: "User created successfully!",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "green",
            }).showToast();

            this.local.write("auth-token", { token: response.token });
          }
        },
        (error: any) => {
          this.isLoading = false;
          const errMsg = error?.error?.message ?? error.message;
          console.log(error);

          Toastify({
            text: `Error: ${errMsg}`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
          }).showToast();
        }
      );
    } else {
      Toastify({
        text: "Please fill out the form correctly.",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "orange",
      }).showToast();
    }
  }
}
