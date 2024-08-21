import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import {  Router, RouterLink } from '@angular/router';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import { FormsModule } from '@angular/forms';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { NewuserComponent } from '../newuser/newuser.component';



@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SidebarComponent, RouterLink, FormsModule, NewuserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  
  suspendUser: boolean; 
  user: any []= []
  users: any = [];
  userRoles: any [] = [];
  userRoleRights: any = [];
  userProfile: any = [];
  selectedValue=undefined;
  isLoading = true
  


constructor (private httpRequest: HttpRequestService, private authData:ServicesidebarService, router:Router, private local: LocalstorageService, public handleModal: ServicesidebarService) 
{ }


ngOnInit(): void {
  // FETCH USERS
  this.httpRequest?.makeGetRequest("/users_management/users/all").subscribe((response:any)=>{
    this.users=response.data
    // console.log(this.users);
    this.isLoading = false;
  },(error:any) => {
    console.log('Error fetching data', error);
    this.isLoading = false;
})
// FETCH USER ROLES
this.httpRequest?.makeGetRequest("/users_management/user_roles/all").subscribe((response: any)=>{
  this.userRoles = response.data
  console.log(this.userRoles);
  this.local.write('userRoles', (this.userRoles))
  if (this.userRoles && this.userRoles.length > 0){
  const role_id = this.userRoles[0].id
  // console.log(role_id);
  // SETTING THE ROLE ID TO BE USED IN CREATE USER
  // localStorage.setItem('role_id', role_id);
  this.local.write('role_id', (role_id))


  //GET USER ROLE RIGHTS
  this.httpRequest?.makeGetRequest(`/users_management/user_role/right?roleId=${role_id}`).subscribe((response:any)=>{
    this.userRoleRights = response.data
  
    console.log(this.userRoleRights);
  }, (error)=>{
    console.log(error);
  })
  }
}, (error:any)=>{
  console.log(error);
})

// const userDetail = this.local.read("identity", )
// const identity = LocalstorageService.read('identity')
// let user = localStorageService.read('auth-token')

// GET USER PROFILE
// this.httpRequest?.makeGetRequest(`/users_management/get_user_profile${identity}`).subscribe((response)=>{
//   this.userProfile = response.data
//   console.log(this.userProfile);
// }, (error)=>{
//   console.log(error);
// })

}

makeFilter=()=>{
  console.log(this.users)
  // console.log(typeof this.selectedValue)
  // console.log( this.selectedValue)
    if(!isNaN(this.selectedValue)){
      return this.users.filter((val)=>val.role_id==this.selectedValue)
    }
    return this.users
}


filter=()=>{
  console.log(this.selectedValue)
}

// SUSPEND USER
suspendUserMethod(itemId: string, action: string): void {
  console.log(`${itemId}, ${action}`);
  
  this.httpRequest.makePatchRequest("/users_management/suspend_user_and_unsuspend_user", { identity: itemId }).subscribe(
    (response) => {
      console.log(response);
      
      // Update the local suspendUser state based on the action
      this.suspendUser = (action === 'suspend') ? true : false;

      console.log(this.suspendUser);
    },
    (error) => {
      console.log(error);
    }
  );
}


createUser() {
  this.handleModal.showMother("new_user")
}
authentication(user:string){
  console.log(user);
  this.httpRequest.makePostRequest('/users_management/create_authenticator_secret', {identity:user}).subscribe((response)=>{
    this.handleModal.showMother("authentication")
    console.log(response);
    // this.authData = response.data;
    this.authData.setAuthData(response)

    // console.log(this.authData);
  }, (error)=>{
    console.log(error);
    
  })

}
}
