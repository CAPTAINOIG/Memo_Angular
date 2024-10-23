import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {
  isLoadingPrevious: boolean = false;
  isLoadingNext: boolean = false;

  foldId = undefined
  page = 1
  allFile: any = [];
  allFolder: any = [];
  isLoading = true;
  recent: any;
  searchTerm: string = '';

  constructor(private httpRequest: HttpRequestService, private handleModal: ServicesidebarService, private editMemo: ServicesidebarService) { }

  ngOnInit(): void {
    this.httpRequest.makeGetRequest('/dashboard/files/all').subscribe((response) => {
      this.allFile = response.data;
      this.isLoading = false
    }, (error) => {
      console.log(error);
    })

    this.httpRequest.makeGetRequest('/dashboard/folder/all').subscribe((response) => {
      this.allFolder = response.data;
    }, (error) => {
      console.log(error);
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
    this.httpRequest?.makeGetRequest("/memo/single?id=" + file).subscribe((response: any) => {
      this.handleModal.setEditMemo(response.data)
      console.log(response.data)
      this.handleModal.showMother("edit_files");
    }, (error: any) => {
      console.log('Error fetching data', error);
      this.isLoading = false;
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

  publish(memId: any) {
    console.log(memId)
    this.handleModal.showMother("otp");
    this.handleModal.setPublishMemId(memId);
  }

  filteredFiles() {
    return this.allFile.filter(item =>
      item.MemTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  format = (dateT: any) => {
    const date = (new Date(dateT))
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

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

