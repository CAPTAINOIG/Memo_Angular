import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css"; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-newuser',
  standalone: true,
  imports: [SidebarComponent, NavigationComponent, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewuserComponent {
  createUserForm: FormGroup;
  isLoading = false;
  userRoles: any = [];  // Array to hold the user roles
  selectedValue: number | undefined;  // Variable to hold the selected value from the dropdown

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private local: LocalstorageService,
    private httpRequest: HttpRequestService
  ) { }

  ngOnInit(): void {
    // Initialize the form with all necessary fields, including role_id
    this.createUserForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],  // Added email validator
      phone: ['', Validators.required],
      role_id: ['', Validators.required],  // Initialize the role_id field
    });

    // Fetch user roles from the API and populate the dropdown
    this.httpRequest.makeGetRequest("/users_management/user_roles/all").subscribe((response: any) => {
      this.userRoles = response.data;
      console.log(this.userRoles);
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.createUserForm.valid) {  // Ensure the form is valid before submission
      this.isLoading = true;
      const data = this.createUserForm.value;
      console.log("Form Data:", data);  // Log form data to verify

      this.httpRequest.makePostRequest('/users_management/create_new_user', data).subscribe(
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
            this.router.navigate(['/portal/user']);
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
