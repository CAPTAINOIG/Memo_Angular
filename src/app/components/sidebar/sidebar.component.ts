import { Component } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    standalone: true,
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  folder: any = [];
  isLoading = true;
  constructor(
    private HttpRequest:HttpRequestService,
    private handleModal: ServicesidebarService,
    private folderService: ServicesidebarService,
  ) {}
  
  ngOnInit(): void {
    // recent_folder
    this.folderService.refreshFolder$.subscribe(shouldRefresh => {
      if (shouldRefresh) {
        this.fetchFolders();
      }
    });
  }
  openModal(){
    this.handleModal.showMother("create_memo")
  };

  fetchFolders(){
  this.HttpRequest?.makeGetRequest("/dashboard/folder/all").subscribe((response:any)=>{
    this.folder = response.data
    // console.log(this.folder);
    this.isLoading = false
  },(error:any) => {
    // console.log('Error fetching data', error);
    this.isLoading = false;
  })
};
}
