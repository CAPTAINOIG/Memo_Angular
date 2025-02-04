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
import { NgxChartsModule } from '@swimlane/ngx-charts';


@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, NavigationComponent, SidebarComponent, RouterLink, NgxChartsModule],
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
  barChartData=[
  ]

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
        this.fetchChartData();
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
  };

  fetchChartData() {
    this.httpRequest?.makeGetRequest("/dashboard/month_on_month_graph?year=2025").subscribe((response: any) => {
      this.barChartData = response.data.map((item: any) => ({name: item.month, value: item.count}))
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
    })
  };

  fetchRecentFiles() {
    this.isLoading = true;
    this.httpRequest?.makeGetRequest("/dashboard/files/recent").subscribe((response: any) => {
      this.recentFiles = response.data
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

  qrCode(memId: any) {
    this.handleModal.setPublishMemId({memId})
    this.handleModal.showMother("qrcode");
  };
  
  viewFiles(recent: any){
    this.httpRequest?.makeGetRequest('/memo/single?id='+recent.MemUniqueId).subscribe((response)=>{
      this.handleModal.showMother("forms")
      this.userData.setUserData(response.data)
    })
  };
  
  editFiles(file: any) {
    this.isEditLoader = true;
    this.httpRequest?.makeGetRequest("/memo/single?id="+file).subscribe((response: any) => {
      // console.log(response.data)
      this.isEditLoader = false;
      this.handleModal.setEditMemo(response.data)
      this.handleModal.showMother("edit_files");
    }, (error: any) => {
      this.isEditLoader = false;
      Toastify({
        text: "Error fetching data",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    })
  };

   approve(memId: any,status:any){
    this.handleModal.showMother("otp");
    this.handleModal.setPublishMemId({memId,status})
  }
}