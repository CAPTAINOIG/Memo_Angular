import { Component } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  folder: any = [];
  isLoading = true;
  constructor(
    private HttpRequest:HttpRequestService,
    private handleModal: ServicesidebarService,
  ) {}
  
  ngOnInit(): void {
    // recent_folder
    this.HttpRequest?.makeGetRequest("/dashboard/folder/all").subscribe((response:any)=>{
      this.folder=response.data
      // console.log(this.folder);
      this.isLoading = false
    },(error:any) => {
      // console.log('Error fetching data', error);
      this.isLoading = false;
    })
  }
  openModal(){
    this.handleModal.showMother("create_memo")
  }
}
