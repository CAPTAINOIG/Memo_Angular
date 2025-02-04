import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"; 
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
    selector: 'app-newuser',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './newuser.component.html',
    styleUrls: ['./newuser.component.css']
})
export class NewuserComponent {
  createUserForm: FormGroup;
  isLoading = false;
  userRoles: any = [];
  selectedValue: number | undefined; 
  // userId: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private local: LocalstorageService,
    private httpRequest: HttpRequestService,
    private handleModal: ServicesidebarService,
    private userService: ServicesidebarService,
    public handleAuthentication: ServicesidebarService,
    private authData: ServicesidebarService,
  ) { }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], 
      phone: ['', Validators.required],
      role_id: ['', Validators.required],  
    });

    this.httpRequest.makeGetRequest("/users_management/user_roles/all").subscribe((response: any) => {
      this.userRoles = response.data;
    });
    (error:any) => {
      this.isLoading = false;
      const errMsg = error?.error?.message ?? error.message;
      Toastify({
        text: `Error: ${errMsg}`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
  }


  onSubmit(): void {
    if (this.createUserForm.valid) {  
      this.isLoading = true;
      const data = this.createUserForm.value;
      this.httpRequest.makePostRequest('/users_management/create_new_user', data).subscribe(
        (response) => {
          const userId = response?.user?.id
          this.userService.triggerUserRefresh();
          this.isLoading = false;
          if (response.status && userId) {
            this.authentication(userId)
            Toastify({
              text: "User created successfully!",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "blue",
            }).showToast();
            this.local.write("auth-token", { token: response.token });
            // this.router.navigate(['/portal/user']);
          }
        },
        (error: any) => {
          this.isLoading = false;
          const errMsg = error?.error?.message ?? error.message;
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

  authentication(user:string){
    this.httpRequest.makePostRequest('/users_management/create_authenticator_secret', {identity:user}).subscribe((response)=>{
      this.handleModal.showMother("authentication")
      this.authData.setAuthData(response)
    }, (error)=>{
      console.log(error);
    })
  
  }

}
