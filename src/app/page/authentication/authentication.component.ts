import { Component } from '@angular/core';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"; 

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
isLoading = false;
createAuthForm: FormGroup;
authData: any;

  constructor(private sidebarService: ServicesidebarService, private fb: FormBuilder, private httpRequest: HttpRequestService,  public handleModals: ServicesidebarService) {}

  ngOnInit() {
    this.authData = this.sidebarService.getAuthData();
    const asciiToken = this.authData.asciiToken
    this.createAuthForm = this.fb.group({
    otp: [''],
    asciiToken: asciiToken
  });
}

  onSubmit(): void{
    this.isLoading = true
    if(this.createAuthForm.valid){
      const auth = this.createAuthForm.value
      this.httpRequest.makePostRequest('/users_management/verify_auth', auth).subscribe((response)=>{
        this.isLoading = false
        Toastify({
          text: "successful!",
          duration: 3000,
          gravity: "top", 
          position: "right",
          backgroundColor: "blue",
        }).showToast();
        this.handleModals.showMother("undefined");
      }, (error)=>{
        this.isLoading = false
        Toastify({
          text: "Error",
          duration: 3000,
          gravity: "top", 
          position: "right", 
          backgroundColor: "red",
        }).showToast();
        
      })
    }
  }
}
