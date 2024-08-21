import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent, FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  imageSrc: string = '../../assets/media/image/user/women_avatar1.jpg';
  base64Image: string | null = null; // To store the Base64 string
  memoImage: string | null = null;
  data: any = undefined;
  isLoading = false
  esignature = {
    title: '',
    image: ''
  };
  recordExists = false;

  ngOnInit(): void {
    this.checkForExistingRecord();
  }

  constructor(private http: HttpRequestService, private handleModal: ServicesidebarService) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.base64Image = reader.result as string;
        this.imageSrc = this.base64Image; // Update imageSrc to display the Base64 string as an image
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }
  }

  uploadImage(): void {
    if (this.base64Image) {
      console.log(this.base64Image);
      const payload = {
        image: this.base64Image
      };
      this.http.makePatchRequest('/users_management/admin/change_profile_picture', payload).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error(error);
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
        //  console.log(this.memoImage);
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }
  }
  // updateMemo(): void {
  //   if(this.memoImage){
  //     console.log(this.memoImage);
  //     const payload = this.memoImage
  //     this.http.makePostRequest('/memo/qrcode/create', payload).subscribe((response)=>{
  //       console.log(response);
  //     }, (error)=>{
  //       console.log(error);
  //     })
  //   }
  //   else {
  //     console.warn('No file selected. Please select an image before uploading.');
  //   }
  // }

  eSignatures() {
    this.handleModal.showMother('esignature')
  }

  checkForExistingRecord() {
    this.isLoading = true
    this.http.makeGetRequest('/memo/mem_e_signature/all').subscribe((response: any) => {
      console.log(response)
      this.isLoading = false
      this.data = Array.isArray(response.data) ? response.data : []; // Extract the data array
      if (this.data.length > 0) {
        this.esignature = this.data[0]; // Load the first signature
        this.recordExists = true; // Set the recordExists flag
      }
      this.isLoading = false
    }, (error) => {
      console.log(error); // Log any errors
      this.isLoading = false
    });

  }


  fileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.esignature.image = e.target.result;
        // console.log(this.esignature.image_path);
      };
      reader.readAsDataURL(file);
    }
  }

  addESignature() {
    if (!this.data) return;
    this.isLoading = true
    try {
      if (this.data.length > 0) {
    this.isLoading = true
        this.http.makePatchRequest(`/memo/mem_e_signature/update/`, { ...this.esignature, identity: this.data[0].id }).subscribe((response) => {
          this.data[0] = response.data
          this.isLoading = false
        });
      }
      else {
        this.http.makePostRequest('/memo/mem_e_signature/create', this.esignature).subscribe((response) => {
          console.log(response);
          this.data[0] = response.data;
          console.log(this.data[0]);
          this.isLoading = false
        }, (error) => {
          console.log(error);
          this.isLoading = false;
        });
      }
    } catch (error) {
    } finally {
      this.isLoading = false
    }
  }
}


