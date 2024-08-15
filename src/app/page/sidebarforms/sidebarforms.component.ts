import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { NewuserComponent } from '../newuser/newuser.component';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";  

@Component({
  selector: 'app-sidebarforms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEditorModule,
    NewuserComponent,
  ],
  templateUrl: './sidebarforms.component.html',
  styleUrls: ['./sidebarforms.component.css']
})
export class SidebarformsComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef;
  step: any;
  memoForm: FormGroup;
  editor: Editor;
  allowed_ips: string[] = [];
  ip_address: string = ''; 
  location: string | null = null;
  ipAddress: string = '';
  areaName:string = ''
  locationDetails: any = null;
  memId: string;
  memo_attachments = [
    {
      name: "Sample",
      size: "20",
      type: "Images"
    }
  ];

  // @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    public handleModals: ServicesidebarService,
    private httpRequest: HttpRequestService
  ) {
    this.memoForm = new FormGroup({
      title: new FormControl('', Validators.required),
      memo: new FormControl('', Validators.required),
      include_signature: new FormControl(false),
      security_type: new FormControl(''),
      secureByEmailOtp: new FormControl(false),
      secureBySmsOtp: new FormControl(false),
      secureByIp: new FormControl(false),
      secureByGeoLocation: new FormControl(false),
      areaName: new FormControl(''),
      ip_address: new FormControl(''),
      // ipAddress: new FormControl('') ,
      create_as_template: new FormControl(false),
      access_type: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.getMemo();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  close() {
    this.handleModals.showMother("undefined");
  }
// CREATING MEMMO
  createMemo(values: any) {
    console.log(values);
    this.httpRequest.makePostRequest('/memo/create', values).subscribe(
      (response) => {
        // console.log(response.id);
         this.memId = response.id
        // console.log(this.memId);
        
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addIP(ip_address: string) {
    if (ip_address && !this.allowed_ips.includes(ip_address)) {
      this.allowed_ips.push(ip_address);
      this.ip_address = ''; 
    } else {
      console.warn('IP address already exists or is invalid.');
      Toastify({
        text: 'IP address already exists or is invalid.',
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "red",
      }).showToast();
    }
  }

  onsubmit() {
    const formValues = { ...this.memoForm.value, ipData: this.allowed_ips, geolocationData:this.locationDetails, memId: this.memId };
    console.log('Form Values:', formValues);
    // this.createMemo(formValues); 
    this.httpRequest.makePostRequest('/memo/mem_secure_rule/create', formValues).subscribe((response)=>{
      // console.log(response);
    })
  }

  onCheckboxChange(event: any) {
    // Logic to handle checkbox change if needed
}

// FOR AREA 
 fetchAreaDetails() {
    this.areaName = this.memoForm.get('areaName')?.value;
    // console.log('Area Name:', this.areaName);

    if (this.areaName) {
      this.httpRequest.fetchAreaDetails(this.areaName)
        .subscribe(
          (data: any) => {
            // console.log(data);
            if (data.results && data.results.length > 0) {
              const result = data.results[0].annotations.DMS; // Get the first result
              this.locationDetails = {
                latitude: result.lat,
                longitude: result.lng,
              };
            } else {
              this.locationDetails = 'No location found for this area.';
            }
          },
          error => {
            this.locationDetails = 'Error fetching area details.';
            console.error(error);
          }
        );
    } else {
      this.locationDetails = null; // Reset if no area name is provided
    }
  }

  getMemo() {
    // Implement your logic to fetch memo data
  }

  getMemoAttachments() {
    // Implement your logic to fetch memo attachments
  }

// FILE ATTACHMENT
  chooseFile() {
    this.fileInput.nativeElement.click();
  }
  fileChangeEvent(event: any): void {
    const uploadLogo = new FormData();
    const image = event.target.files[0];
    
    if (image) {
      console.log(image);
      uploadLogo.append('image', image, image.name);
      this.httpRequest.makePostRequest('/memo/upload_image', uploadLogo,true).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      console.warn('No file selected.');
    }
  }

  changeSecurityType() {
    // Implement your logic to handle security type changes
  }



  // SELECT ACCESS TYPE. SHARING PAGE
  selectFile() {
    this.fileInput.nativeElement.click();
  }
  handleChangeEvent(event: any): void {
    const uploadLogo = new FormData();
    const image = event.target.files[0];
    
    if (image) {
      console.log(image);
      uploadLogo.append('image', image, image.name);
      this.httpRequest.makePostRequest('/memo/access_type/create', uploadLogo,true).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      console.warn('No file selected.');
    }
  }
}
