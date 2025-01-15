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
import { HeaderComponent } from '../../components/header/header.component';
import Toastify from 'toastify-js'; 
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, NavigationComponent, HeaderComponent, SidebarComponent, RouterLink, FormsModule, NewuserComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  // private folderSubject = new BehaviorSubject<any[]>([]);
  // allFolder$ = this.folderSubject.asObservable();
  
  suspendUser: boolean; 
  user: any []= []
  users: any = [];
  userRoles: any [] = [];
  userRoleRights: any = [];
  userProfile: any = [];
  selectedValue=undefined;
  isLoading = true
  


constructor (private httpRequest: HttpRequestService, private authData:ServicesidebarService, router:Router, private local: LocalstorageService, public handleModal: ServicesidebarService, private userServive: ServicesidebarService, private suspendUnsuspendUser: ServicesidebarService) 
{ }


ngOnInit(): void {
  
this.userServive.refreshUser$.subscribe(shouldRefresh => {
  if(shouldRefresh){
    this.fetchUsers();
  }
});

this.suspendUnsuspendUser.suspendUser$.subscribe(shouldRefresh => {
  if(shouldRefresh){
    this.selectedValue();
  }
});
// FETCH USER ROLES
this.httpRequest?.makeGetRequest("/users_management/user_roles/all").subscribe((response: any)=>{
  this.userRoles = response.data
  this.local.write('userRoles', (this.userRoles))
  if (this.userRoles && this.userRoles.length > 0){
  const role_id = this.userRoles[0].Id
  this.local.write('role_id', (role_id))


  this.httpRequest?.makeGetRequest(`/users_management/user_role/right?roleId=${role_id}`).subscribe((response:any)=>{
    this.userRoleRights = response.data
  }, (error)=>{
    // console.log(error);
  })
  }
}, (error:any)=>{
});

};


fetchUsers(){
  this.httpRequest?.makeGetRequest("/users_management/users/all").subscribe((response:any)=>{
    this.users=response.data
    this.isLoading = false;
  },(error:any) => {
    this.isLoading = false;
})
}

makeFilter=()=>{
    if(!isNaN(this.selectedValue)){
      return this.users.filter((val: any)=>val.role_id==this.selectedValue)
    }
    return this.users
}


filter=()=>{
  // console.log(this.selectedValue)
}

// SUSPEND USER
suspendUserMethod(itemId: string, action: string): void {
  this.httpRequest.makePatchRequest("/users_management/suspend_user_and_unsuspend_user", { identity: itemId }).subscribe(
    (response) => {
      this.suspendUnsuspendUser.triggerSuspendUserRefresh();
      Toastify({
        text: response.message,
        duration: 3000,
        gravity: "top", 
        position: "right",
        backgroundColor: "blue",
      }).showToast();
      this.suspendUser = (action === 'suspend') ? true : false;
    },
    (error) => {
      Toastify({
          text: `${error.message}`,
          duration: 3000,
          gravity: "top", 
          position: "right",
          backgroundColor: "blue",
        }).showToast();
    }
  );
}


createUser() {
  this.handleModal.showMother("new_user")
}

authentication(user:string){
  this.httpRequest.makePostRequest('/users_management/create_authenticator_secret', {identity:user}).subscribe((response)=>{
    this.handleModal.showMother("authentication")
    console.log(response);
    this.authData.setAuthData(response)
  }, (error)=>{
    console.log(error);
  })

}
}
