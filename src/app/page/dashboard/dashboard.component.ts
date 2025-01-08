import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { HeaderComponent } from "../../components/header/header.component"
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { Router, RouterLink } from '@angular/router';
import Toastify from 'toastify-js';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SidebarComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSuperAdmin: boolean = false;
  data: any = [];
  monthOnMonthGraph: any = [];
  recentFiles: any = []
  isLoading = true;
  isEditLoader = false;
  sidebarVisible: boolean = false;
  recent: any;
  file: any;
  activities: any;
  isAdmin=JSON.parse(localStorage.getItem('isAdmin')??'false')
  status = []
  statusClasses = ['bg-secondary', 'bg-warning text-dark', 'bg-success', 'bg-danger'];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; 
  }
  constructor(
    private httpRequest: HttpRequestService,
    private handleModal: ServicesidebarService,
    private userData: ServicesidebarService,
    private router: Router,
    private fileService: ServicesidebarService,
  ) {

  }

  ngOnInit(): void {
    this.status = this.userData.status

    this.fileService.refreshFile$.subscribe(shouldRefresh => {
      if (shouldRefresh) {
        this.fetchRecentFiles();
      }
    });
   
      this.isLoading = true;
      this.httpRequest.makeGetRequest('/memo/memo_activities').subscribe((response)=>{
        this.activities = response.data;
        this.isLoading = false;
      }, (error)=>{
        // console.log(error);
        this.isLoading = false;
        if(error.error.message){
          Toastify({
            text: "Token Expired!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
          }).showToast();
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
      })


    this.httpRequest?.makeGetRequest("/dashboard/folder/recent").subscribe((response: any) => {
      this.data = response.data;
      this.isLoading = false;
    }, (error: any) => {
      // console.log(error);
      this.isLoading = false;
      Toastify({
        text: "Error fetching data",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    })
    // Graph
    this.httpRequest?.makeGetRequest("/dashboard/month_on_month_graph?year=2024").subscribe((response: any) => {
      this.monthOnMonthGraph = response.data
      this.isLoading = false;
    }, (error: any) => {
      // console.log('Error fetching data', error);
      this.isLoading = false;
    })
  };

  fetchRecentFiles() {
    this.isLoading = true;
    this.httpRequest?.makeGetRequest("/dashboard/files/recent").subscribe((response: any) => {
      this.recentFiles = response.data
      // console.log(this.recentFiles);
      this.isLoading = false;
    }, (error: any) => {
      // console.log(error);
      this.isLoading = false;
    })
  }
  
  openModal(){
    this.handleModal.showMother("create_memo")
    this.handleModal.toggleCheck('hello')
  }
  
  viewFiles(recent: any){
    this.httpRequest?.makeGetRequest('/memo/single?id='+recent.MemUniqueId).subscribe((response)=>{
      this.handleModal.showMother("forms")
      this.userData.setUserData(response.data)
    })
  }
  editFiles(file: any) {
    this.isEditLoader = true;
    this.httpRequest?.makeGetRequest("/memo/single?id="+file).subscribe((response: any) => {
      // console.log(response.data)
      this.handleModal.showMother("edit_files");
      this.handleModal.setEditMemo(response.data)
      this.isEditLoader = false;
    }, (error: any) => {
      Toastify({
        text: "Error fetching data",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      this.isEditLoader = false;
    })
  }

  format=(dateT:any)=> {
    const date= (new Date(dateT))
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
   }
   
   formatTime(dateT: any): string {
     const date = new Date(dateT);
     const hours = String(date.getHours()).padStart(2, '0');
     const minutes = String(date.getMinutes()).padStart(2, '0');
     const seconds = String(date.getSeconds()).padStart(2, '0');
     return `${hours}:${minutes}:${seconds}`;
   }
   
   approve(memId: any,status:any){
    this.handleModal.showMother("otp");
    this.handleModal.setPublishMemId({memId,status})
  }
}
