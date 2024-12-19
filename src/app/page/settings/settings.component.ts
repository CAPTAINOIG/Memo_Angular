import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { tick } from '@angular/core/testing';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  imageSrc: string = '../../assets/media/image/user/women_avatar1.jpg';
  base64Image: string | null = null;
  memoImage: string | null = null;
  data: any = undefined;
  user: any = {};
  isLoading = false
  isLoadingImage = false
  esignature = {
    title: '',
    image: ''
  };
  recordExists = false;

  ngOnInit(): void {
    this.checkForExistingRecord();

    const userName = this.http.makeGetRequest('/auth/user').subscribe((response)=>{
      this.user = response.data;
      
    }, (error)=>{
      console.log(error);
    })
  }

  constructor(private http: HttpRequestService, private handleModal: ServicesidebarService) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.imageSrc = this.base64Image;
      };
      reader.readAsDataURL(file); 
    }
  }

  uploadImage(): void {
    this.isLoadingImage = true;
    if (this.base64Image) {
      const payload = {
        image: this.base64Image
      };
      this.http.makePatchRequest('/users_management/admin/change_profile_picture', payload).subscribe(
        (response) => {
          this.isLoadingImage=false
        },
        (error) => {
          console.error(error);
          this.isLoadingImage = false;
        }
      );
    } else {
      console.warn('No file selected. Please select an image before uploading.');
    }
  }

  returnData() {
    return this.data || []
  }

  handleImageChange(event: any) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.memoImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  eSignatures() {
    this.handleModal.showMother('esignature')
  }

  checkForExistingRecord() {
    this.isLoading = true
    this.http.makeGetRequest('/memo/mem_e_signature/all').subscribe((response: any) => {
      console.log(response)
      this.isLoading = false
      this.data = Array.isArray(response.data) ? response.data : [];
      if (this.data.length > 0) {
        this.esignature = this.data[0]; 
        this.recordExists = true; 
      }
      this.isLoading = false
    }, (error) => {
      console.log(error); 
      this.isLoading = false
    });

  }


  fileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.esignature.image = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // addESignature() {
  //   console.log(this.esignature)
  //   console.log(this.data[0].Id)
  //   if (!this.data) {
  //     Toastify({
  //       text: `${this.data} is not available`,
  //       duration: 3000,
  //       gravity: "top",
  //       position: "right",
  //       backgroundColor: "red",
  //     }).showToast();
  //     return;
  //   }
  //   this.isLoading = true;
  //   try {
  //     if (!this.data) {
  //       Toastify({
  //         text: `${this.data} is not available`,
  //         duration: 3000,
  //         gravity: "top",
  //         position: "right",
  //         backgroundColor: "red",
  //       }).showToast();
  //       return;
  //     }
  //     if (this.data.length > 0) {
  //       this.isLoading = true;
  //       this.http.makePatchRequest(`/memo/mem_e_signature/update/`, { ...this.esignature, identity: this.data[0].Id }).subscribe((response) => {
  //         this.data[0] = response.data
  //         console.log(response.error);
          
  //         console.log(this.data[0]);
  //         this.isLoading = false
  //       });
  //     }
  //     else {
  //       this.http.makePostRequest('/memo/mem_e_signature/create', this.esignature).subscribe((response) => {
  //         console.log(response);
  //         this.data[0] = response.data;
  //         console.log(this.data[0]);
  //         this.isLoading = false
  //       }, (error) => {
  //         console.log(error.error);
  //         this.isLoading = false;
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     this.isLoading = false
  //   }
  // }


  addESignature() {
    console.log(this.esignature)
    console.log(this.data[0].Id)
    if (!this.esignature.title || !this.esignature.image || !this.data[0].Id) {
      Toastify({
        text: "Please fill in all required fields!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      return;
    }
  
    this.isLoading = true;
    const request$ = this.data && this.data.length > 0
      ? this.http.makePatchRequest(`/memo/mem_e_signature/update/`, { ...this.esignature, identity: this.data[0].Id })
      : this.http.makePostRequest('/memo/mem_e_signature/create', this.esignature);
  
    request$.subscribe(
      (response) => {
        Toastify({
          text: this.data.length > 0 ? "E-Signature Updated Successfully!" : "E-Signature Added Successfully!",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "green",
        }).showToast();
  
        this.data[0] = response.data;
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        Toastify({
          text: "An error occurred. Please try again.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
        this.isLoading = false;
      }
    );
  }
  
}


