import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { Router, RouterLink } from '@angular/router';
import Toastify from 'toastify-js'; 

@Component({
    selector: 'app-twofactorauth',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './twofactorauth.component.html',
    styleUrls: ['./twofactorauth.component.css']
})
export class TwofactorauthComponent {
  authForm:FormGroup
  isLoading = false; 
  isSuccess: boolean = true;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private local:LocalstorageService,
   private httpRequest:HttpRequestService
  ) {
    this.authForm = this.fb.group({
      otp: ['', Validators.required],
    });
  }
  onSubmit(){
    if(!this.authForm.valid){
      Toastify({
        text: "Please fill all the fields",
        duration: 3000,
        gravity: "top", 
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
    else{
      this.isLoading = true;
      const data = this.authForm.value
      this.httpRequest.makePostRequest(`/auth/validate_two_fact_auth`, data).subscribe({
        next: (data:any) => {
          this.isLoading = false;
          Toastify({
            text: "Authentication successful!",
            duration: 3000,
            gravity: "top", 
            position: "right",
            backgroundColor: "blue",
          }).showToast();
          this.router.navigate(['/portal/dashboard']);
        },
        error: (err:any) => {
          this.isLoading = false;
          Toastify({
            text: `Authentication failed! ${err.error.message}`,
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
