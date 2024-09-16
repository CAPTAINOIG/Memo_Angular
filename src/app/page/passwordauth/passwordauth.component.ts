
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Toastify from 'toastify-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-passwordauth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './passwordauth.component.html',
  styleUrls: ['./passwordauth.component.css']
})
export class PasswordauthComponent {
  authForm:FormGroup
  isLoading = false; 
  token: string;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
  }
  
  ngOnInit(): void {
    this.token = JSON.parse(localStorage.getItem('passwordToken'));
    console.log(this.token);
    this.authForm = new FormGroup({
      otp: new FormControl('', [Validators.required])
    });
  }
  // ngOnInt(){
  //   this.authForm = this.fb.group({
  //     otp: ['', Validators.required],
  //   });
  // }
  
  onSubmit(): void {
    if (!this.authForm.valid) {
      Toastify({
        text: 'OTP cannot be empty.',
        backgroundColor: 'red',
        gravity: 'top',
        position: 'right',
        duration: 3000,
      }).showToast();
      return;
    }

    this.isLoading = true;
    const otpData = this.authForm.value;
    console.log(otpData);
    

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      "ngrok-skip-browser-warning": '69420',
    });

    this.http.post('https://45a5-102-88-62-203.ngrok-free.app/api/auth/verify_two_fact_auth', otpData, { headers })
      .subscribe((response: any) => {
        console.log(response);
          this.isLoading = false;
          Toastify({
            text: 'OTP verified successfully!',
            backgroundColor: 'blue',
            gravity: 'top',
            position: 'right',
            duration: 3000,
          }).showToast();
          this.router.navigate(['/resetpassword']); 
        },
        (error) => {
          this.isLoading = false;
          Toastify({
            text: 'Failed to verify OTP. Please try again.',
            backgroundColor: 'red',
            gravity: 'top',
            position: 'right',
            duration: 3000,
          }).showToast();
          console.error(error);
        }
      );
  }
}
 
