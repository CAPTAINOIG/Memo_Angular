import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import {  Router } from '@angular/router';
import { UsermodalComponent } from "../usermodal/usermodal.component";
// import { Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SidebarComponent, UsermodalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: any = [];
  userRoles: any = [];
  userRoleRights: any = [];
  userProfile: any = [];
  // isSuccess: any = [];
  // isLoading = false
constructor (private httpRequest: HttpRequestService, router:Router) 
{
  // this.createUsers = this.fb.group({ 
  //   // required
  //   this.full_name: ['', Validators.required], 
  //   this.email: ['', Validators],
  //   this.phone: ['', Validators],
  //   this.role_id: ['', Validators],
  //   // not required
  //   this.full_name: [''], 
  //   this.email: [''],
  //   this.phone: [''],
  //   this.role_id: [''],
  // })
}


ngOnInit(): void {
  // Fetch users
  this.httpRequest?.makeGetRequest("/users_management/users/all").subscribe((response:any)=>{
    this.users=response.data
    // console.log(this.users);
  },(error:any) => {
    console.log('Error fetching data', error);
})
// Fetch user roles
this.httpRequest?.makeGetRequest("/users_management/user_roles/all").subscribe((response: any)=>{
  this.userRoles = response.data
  // console.log(this.userRoles);
}, (error:any)=>{
  console.log(error);
})

// Get user role rights
// this.httpRequest?.makeGetRequest('users_management/user_role/right?roleId=1').subscribe((response:any)=>{
//   this.userRoleRights = response.data
//   console.log(this.userRoleRights);
// }, (error)=>{
//   console.log(error);
// })

// console.log(this.localstorage.read("auth-token")?.token)
// const userDetail = this.local.read("identity", )
// Get user profile

// this.httpRequest?.makeGetRequest(`/users_management/get_user_profile${identity}`).subscribe((response)=>{
//   this.userProfile = response.data
//   console.log(this.userProfile);
// }, (error)=>{
//   console.log(error);
  
// })


// Create users
// onSubmit() {
//   if (this.createUsers.valid) {
//     this.isLoading = true;
//     const value = this.createUsers.value;
    // con
// this.httpRequest.makePostRequest('', value).subscribe((response)=>{
//     this.isLoading = false;
//   this.createUsers = response.data;
//   console.log(this.createUsers);
// }, (error)=>{
//   console.log(error);
//     this.isLoading = false;
// }
// )
  // }
// }

}
}
