import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import Toastify from 'toastify-js';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {
private folderSubject = new BehaviorSubject<any[]>([]);
allFolder$ = this.folderSubject.asObservable();

  isLoadingPrevious: boolean = false;
  isLoadingNext: boolean = false;
  foldId = undefined
  page = 1
  allFile: any = [];
  allFolder: any = [];
  isLoading = true;
  isEditLoader = false;
  recent: any;
  searchTerm: string = '';
  filterStatus: string = '';
  status =[]
  statusClasses = ['bg-secondary', 'bg-warning text-dark', 'bg-success', 'bg-danger'];
  
  isAdmin=JSON.parse(localStorage.getItem('isAdmin')??'false')


  constructor(private httpRequest: HttpRequestService, private handleModal: ServicesidebarService, private editMemo: ServicesidebarService, private folderService: ServicesidebarService, private fileService: ServicesidebarService) { }

  ngOnInit(): void {
    this.status = this.handleModal.status

    this.folderService.refreshFolder$.subscribe(shouldRefresh => {
      if (shouldRefresh) {
        this.loadFolders();
      }
    });

    this.fileService.refreshFile$.subscribe(shouldRefresh => {
      if (shouldRefresh) {
        this.loadFiles();
      }
    });
  };

  loadFiles(){
    this.httpRequest.makeGetRequest('/dashboard/files/all').subscribe((response) => {
      this.allFile = response.data;
      this.isLoading = false
    }, (error) => {
      Toastify({
        text: "Error fetching data",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    })
  }
  
  loadFolders() {
  this.httpRequest.makeGetRequest('/dashboard/folder/all').subscribe((response) => {
    this.folderSubject.next(response.data);
  }, (error) => {
    Toastify({
      text: "Error fetching data",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "red",
    }).showToast();
  })
}

  previous() {
    this.isLoadingPrevious = true;
    this.page -= 1
    if (this.page > 0) {
      this.httpRequest.makeGetRequest(`/dashboard/files/all?page=${this.page}&foldId=${this.foldId}`).subscribe((response) => {
        this.allFile = response.data;
        this.isLoadingPrevious = false;

      }, (error) => {
        console.log(error);
        this.isLoadingPrevious = false;
      })
    }

  }

  next() {
    this.isLoadingNext = true;
    this.page += 1
    this.httpRequest.makeGetRequest(`/dashboard/files/all?page=${this.page}&foldId=${this.foldId}`).subscribe((response) => {
      this.allFile = response.data;
      this.isLoadingNext = false;
    }, (error) => {
      console.log(error);
      this.isLoadingNext = false;
    })
  }

  editFiles(file: any) {
    this.isEditLoader = true;
    this.httpRequest?.makeGetRequest("/memo/single?id=" + file).subscribe((response: any) => {
      this.handleModal.setEditMemo(response.data)
      // console.log(response.data)
      this.handleModal.showMother("edit_files");
      this.isEditLoader = false;
    }, (error: any) => {
      // console.log('Error fetching data', error);
      this.isLoading = false;
      Toastify({
        text: "Error fetching data",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    })
  }

  foldName(id: any | number) {
    this.isLoading = true;
    this.foldId = id
    this.page = 1
    this.httpRequest.makeGetRequest('/dashboard/files/all?page=1&foldId=' + id).subscribe((response) => {
      this.allFile = response.data;
      this.isLoading = false;
    })
  }

  approve(memId: any, status:any) {
    this.handleModal.showMother("otp");
    this.handleModal.setPublishMemId({memId, status})
  }
  

  // filteredFiles() {
  //   return this.allFile.filter(item =>item?.IsPublished && item?.IsPublished.toLowerCase().includes(this.searchTerm.toLowerCase()));
  // }

    setFilterStatus(status: string): void {
    this.filterStatus = status;
  }

  filteredFiles() {
    return this.allFile.filter(item => {
      const matchesSearch = item?.MemTitle?.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.filterStatus === '' || (this.filterStatus === 'approved' && item.IsPublished === 2) || (this.filterStatus === 'pending' && item.IsPublished === 1);
      return matchesSearch && matchesStatus;
    });
  }

  // format = (dateT: any) => {
  //   const date = (new Date(dateT))
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); 
  //   const day = String(date.getDate()).padStart(2, '0');
  //   return `${year}-${month}-${day}`;
  // }

  createFolders() {
    this.handleModal.showMother("create_folder")
  }



  copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    Toastify({
      text: 'Link copied to clipboard!',
      duration: '3000',
      position: 'right',
      gravity: 'top',
      backgroundColor: 'blue',
    }).showToast();
  }

}

