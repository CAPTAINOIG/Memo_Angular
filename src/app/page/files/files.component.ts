import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, ReactiveFormsModule, FormsModule , CommonModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {
  isLoadingPrevious: boolean = false;
  isLoadingNext: boolean = false;
  
foldId=undefined
page=1
allFile: any  = [];
allFolder: any = [];
recent: any;
  constructor(private httpRequest: HttpRequestService, private handleModal: ServicesidebarService, private editMemo: ServicesidebarService) { }

  ngOnInit(): void {
    this.httpRequest.makeGetRequest('/dashboard/files/all').subscribe((response)=>{
      this.allFile = response.data;
      console.log(this.allFile);
    
    },(error)=>{
      console.log(error);
    })


    this.httpRequest.makeGetRequest('/dashboard/folder/all').subscribe((response)=>{
      this.allFolder = response.data;
      console.log(this.allFolder);
    
    },(error)=>{
      console.log(error);
    })
  }

  previous (){
    this.isLoadingPrevious= true;
    this.page-=1
    if(this.page>0){
      this.httpRequest.makeGetRequest(`/dashboard/files/all?page=${this.page}&foldId=${this.foldId}`).subscribe((response)=>{
        this.allFile = response.data;
        console.log(this.allFile);
      this.isLoadingPrevious= false;
      
      },(error)=>{
        console.log(error);
      this.isLoadingPrevious= false;
      })
    }

  }
  next(){
    this.isLoadingNext = true;
    this.page+=1
    this.httpRequest.makeGetRequest(`/dashboard/files/all?page=${this.page}&foldId=${this.foldId}`).subscribe((response)=>{
      this.allFile = response.data;
      console.log(this.allFile);
      this.isLoadingNext= false;
    },(error)=>{
      console.log(error);
      this.isLoadingNext= false;
    })
  }
  editFiles(file: any){
    if (!file) {
      console.error('No file passed to editFiles method.');
      return;
    }
    this.handleModal.showMother("edit_files");
    console.log(file); 
    this.editMemo.setEditMemo(file)
  }
  foldName(id:any|number){
    this.foldId=id
    this.page=1
    this.httpRequest.makeGetRequest('/dashboard/files/all?page=1&foldId='+id).subscribe((response)=>{
      this.allFile = response.data;
    })
  }
  }
  
