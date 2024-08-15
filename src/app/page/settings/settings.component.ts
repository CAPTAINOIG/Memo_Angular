import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NavigationComponent, SidebarComponent ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  imageSrc: string = '../../assets/media/image/user/women_avatar1.jpg'; 
  base64Image: string | null = null; // To store the Base64 string
  memoImage: string | null = null;

  constructor(private http: HttpRequestService) { }

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

  handleImageChange(event: any) {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () =>{
        this.memoImage = reader.result as string;
        //  console.log(this.memoImage);
      };
      reader.readAsDataURL(file); // Convert the file to Base64
    }
      }
      updateMemo(): void {
        if(this.memoImage){
          // console.log(this.memoImage);
          const payload = this.memoImage
          this.http.makePostRequest('/memo/qrcode/create', payload).subscribe((response)=>{
            console.log(response);
          }, (error)=>{
            console.log(error);
          })
        }
        else {
          console.warn('No file selected. Please select an image before uploading.');
        }
      }
    }
  

