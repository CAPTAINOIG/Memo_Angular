import { Component } from '@angular/core';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';

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

  constructor(private sidebarService: ServicesidebarService, private fb: FormBuilder,private httpRequest: HttpRequestService) {}

  ngOnInit() {
    this.authData = this.sidebarService.getAuthData();
    // console.log(this.authData.url);
    const asciiToken = this.authData.asciiToken
    // console.log(asciiToken);
    
    this.createAuthForm = this.fb.group({
    otp: [''],
    asciiToken: asciiToken
  });
}

  onSubmit(): void{
    this.isLoading = true
    if(this.createAuthForm.valid){
      const auth = this.createAuthForm.value
      // console.log(auth);
      this.httpRequest.makePostRequest('/users_management/verify_auth', auth).subscribe((response)=>{
        console.log(response);
        this.isLoading = false
      }, (error)=>{
        console.log(error);
        this.isLoading = false
        
      })
      
    }
  }
}
