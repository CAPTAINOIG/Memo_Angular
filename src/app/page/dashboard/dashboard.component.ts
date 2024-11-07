import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { HeaderComponent } from "../../components/header/header.component"
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { Router, RouterLink } from '@angular/router';
import Toastify from 'toastify-js';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SidebarComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // sidebar: boolean = false; 
  data: any = [];
  monthOnMonthGraph: any = [];
  recentFiles: any = []
  isLoading = true;
  sidebarVisible: boolean = false;
  recent: any;
  file: any;
  activities: any;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; 
  }
  constructor(
    private httpRequest: HttpRequestService,
    private handleModal: ServicesidebarService,
    private userData: ServicesidebarService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
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
          this.router.navigate(['/']);
        }
      })


    this.httpRequest?.makeGetRequest("/dashboard/folder/recent").subscribe((response: any) => {
      this.data = response.data;
      // console.log(this.data);
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
    })
    // Graph
    this.httpRequest?.makeGetRequest("/dashboard/month_on_month_graph?year=2024").subscribe((response: any) => {
      this.monthOnMonthGraph = response.data
      this.isLoading = false;
    }, (error: any) => {
      // console.log('Error fetching data', error);
      this.isLoading = false;
    })
    this.httpRequest?.makeGetRequest("/dashboard/files/recent").subscribe((response: any) => {
      this.recentFiles = response.data
      this.isLoading = false;
    }, (error: any) => {
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
    this.httpRequest?.makeGetRequest("/memo/single?id="+file).subscribe((response: any) => {
      this.handleModal.setEditMemo(response.data)
      this.handleModal.showMother("edit_files");
    }, (error: any) => {
      console.log('Error fetching data', error);
      this.isLoading = false;
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
   
   publish(memId: any){
    console.log(memId)
    this.handleModal.showMother("otp");
    this.handleModal.setPublishMemId(memId);
  }
}
