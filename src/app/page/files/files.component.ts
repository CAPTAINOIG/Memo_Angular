import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, ReactiveFormsModule, FormsModule , CommonModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {
isLoading = false;
allFolder: any  = [];
recent: any;
  constructor(private httpRequest: HttpRequestService) { }

  ngOnInit(): void {
    this.httpRequest.makeGetRequest('/dashboard/files/all').subscribe((response)=>{
      this.allFolder = response.data;
      console.log(this.allFolder);
    },(error)=>{
      console.log(error);
    })
  }
  editFiles(){

  }
  viewFiles(recent: any){

  }
}
