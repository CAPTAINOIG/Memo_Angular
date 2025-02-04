import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-activities',
    imports: [NavigationComponent, SidebarComponent, CommonModule, ReactiveFormsModule],
    templateUrl: './activities.component.html',
    styleUrl: './activities.component.css'
})
export class ActivitiesComponent {
activities: any;
isLoading = false;
constructor (private service: ServicesidebarService, private httpRequest: HttpRequestService) { }

ngOnInit() : void {
this.memoAcitivities()
}

memoAcitivities() {
  this.isLoading = true;
  this.httpRequest.makeGetRequest('/memo/memo_activities').subscribe((response)=>{
    this.activities = response.data;
    this.isLoading = false;
  }, (error)=>{
    console.log(error);
    this.isLoading = false;
  })
}
format=(dateT:any)=> {
 const date= (new Date(dateT))
 const year = date.getFullYear();
 const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
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
}
