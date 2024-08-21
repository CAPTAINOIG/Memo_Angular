import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { Router, RouterLink } from '@angular/router';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"; 

@Component({
  selector: 'app-twofactorauth',
  standalone: true,
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
    if(this.authForm.value){
      this.isLoading = true;
 
      const data = this.authForm.value
      // console.log(data);

      this.httpRequest.makePostRequest(`/auth/validate_two_fact_auth`, data).subscribe({
        next: (data:any) => {
          this.isLoading = false;
          Toastify({
            text: "Authentication successful!",
            duration: 3000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "green",
          }).showToast();
          this.router.navigate(['/portal/dashboard']);
        },
        error: (err:any) => {
          this.isLoading = false;
          console.log(err);
          Toastify({
            text: `Error: ${err}`,
            duration: 3000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
        }
      });
    }
  }
}
