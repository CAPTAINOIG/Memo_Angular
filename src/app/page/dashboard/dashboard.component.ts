import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { HeaderComponent } from "../../components/header/header.component"
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { SidebargroupComponent } from '../sidebargroup/sidebargroup.component';
import { ServicesidebarService } from '../../service/servicesidebar.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavigationComponent, SidebarComponent, SidebargroupComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // sidebar: boolean = false; 
  data: any = [];
  monthOnMonthGraph: any = [];
  recentFiles: any = []
  isLoading = true;
  sidebarVisible: boolean = false; // Sidebar is hidden by default

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible; // Toggle the sidebar visibility
  }


  constructor(
    private httpRequest: HttpRequestService,
    private handleModal: ServicesidebarService
  ) {

  }

  // ngOnInit => onload
  ngOnInit(): void {
    // this.isLoading = true
    // recent_folder
    this.httpRequest?.makeGetRequest("/dashboard/folder/recent").subscribe((response: any) => {
      this.data = response.data;
      // console.log(this.data);
      this.isLoading = false;
    }, (error: any) => {
      // console.log('Error fetching data', error);
      this.isLoading = false;
    })
    // Graph
    this.httpRequest?.makeGetRequest("/dashboard/month_on_month_graph?year=2024").subscribe((response: any) => {
      this.monthOnMonthGraph = response.data
      // console.log(this.monthOnMonthGraph);
      this.isLoading = false;
    }, (error: any) => {
      console.log('Error fetching data', error);
      this.isLoading = false;
    })
    // /recent_files
    this.httpRequest?.makeGetRequest("/dashboard/recent_files").subscribe((response: any) => {
      this.recentFiles = response.data
      this.isLoading = false;
      // console.log(this.recentFiles);
    }, (error: any) => {
      console.log('Error fetching data', error);
      this.isLoading = false;
    })
  }


  openModal(){
    this.handleModal.showMother("create_memo")
  }
}
