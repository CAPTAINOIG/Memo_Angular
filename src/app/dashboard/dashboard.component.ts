import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../service/HttpRequest/http-request.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  data: any=[];
  monthOnMonthGraph:any=[];
  recentFiles:any=[]
  constructor(
    private httpRequest:HttpRequestService
  ) { 

  }

  // ngOnInit => onload
  ngOnInit(): void {
    // recent_folder
    this.httpRequest?.makeGetRequest("get","/dashboard/recent_folder").subscribe((response:any)=>{
      this.data=response.data
      // console.log(this.data);
    },(error:any) => {
      // console.log('Error fetching data', error);
 })
      // Graph
    this.httpRequest?.makeGetRequest("get","/dashboard/month_on_month_graph?year=2024").subscribe((response:any)=>{
      this.monthOnMonthGraph=response.data
      // console.log(this.monthOnMonthGraph);
    },(error:any) => {
      console.log('Error fetching data', error);
 })
  // /recent_files
    this.httpRequest?.makeGetRequest("get","/dashboard/recent_files").subscribe((response:any)=>{     
      this.recentFiles = response.data
      console.log(this.recentFiles);
    },(error:any) => {
      console.log('Error fetching data', error);
 })
  


   
  }
}
