import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { NewuserComponent } from '../newuser/newuser.component';
import Toastify from 'toastify-js';

import { UserdetailComponent } from '../../userdetail/userdetail.component';
import { AuthenticationComponent } from "../authentication/authentication.component";
import { EsignatureComponent } from '../esignature/esignature.component';
import { EditmemoComponent } from '../editmemo/editmemo.component';
import { OtpconfirmationComponent } from '../otpconfirmation/otpconfirmation.component';
import { CreatefolderComponent } from '../createfolder/createfolder.component';
import { CreateqrcodeComponent } from '../../createqrcode/createqrcode.component';

@Component({
  selector: 'app-sidebarforms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEditorModule,
    NewuserComponent,
    UserdetailComponent,
    AuthenticationComponent,
    EsignatureComponent,
    EditmemoComponent,
    OtpconfirmationComponent,
    CreatefolderComponent,
    CreateqrcodeComponent
  ],
  templateUrl: './sidebarforms.component.html',
  styleUrls: ['./sidebarforms.component.css']
})
export class SidebarformsComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('fileInput') fileInput!: ElementRef;
  step: any;
  memoForm: FormGroup;
  editor: Editor;
  allowed_ips: string[] = [];
  ip_address: string = '';
  location: string | null = null;
  ipAddress: string = '';
  areaName: string = '';
  locationDetails: any = {};
  area_location: string[] = [];
  template: any = [];
  selectedAllFolder: any = [];
  memId: string;

  isLoading = false;
  qrCodeCheckInterval: any;
  updateMemoMemUniqueId: any;
  showSubmitButton: boolean = false;
  fetchLatAndLng: any;
  fetchLatAndLngInterval: any;
  iframeVisible = false;
  countrySelected = false;
  selectedCountry: string = '';

  

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
    private httpRequest: HttpRequestService,
    private fb: FormBuilder
  ) 
  {
    this.memoForm = new FormGroup({
      title: new FormControl('',
        Validators.required),
      memo: new FormControl('',
        Validators.required),
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
      access: new FormControl(''),
      public: new FormControl (''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
    });

  }
  
  handle(data:any=undefined){
    this.handleModals.setCreateMemoTabs(data)
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.fetchFolders();
    this.getIp();
    // this.latAndLng();
  }
  ngDoCheck(): void {
    if (this.handleModals.show == "edit_files" && this.handleModals.check == "nothing") {
      const check = this.handleModals.show == "edit_files"
      this.memoForm.setValue({
        title: check ? this.handleModals?.editMemo?.MemTitle : '',
        memo: check ? this.handleModals?.editMemo?.MemContents : '',
        include_signature: false,
        security_type: false,
        secureByEmailOtp: false,
        secureBySmsOtp: false,
        secureByIp: false,
        secureByGeoLocation: false,
        areaName: '',
        ip_address: '',
        create_as_template: false,
        access: '',
        name: '',
        email: '',
        phone: '',
      })
      this.handleModals.toggleCheck("hello")
    }
  }

  showIframe(){
    this.iframeVisible = true;
  }

  
  fetchAreaDetails() {
    this.areaName = this.memoForm.get('areaName')?.value;
    this.area_location.push(this.areaName);
    console.log('Area Name:', this.areaName); 
    this.memoForm.get('areaName')?.reset();
  }
  // latAndLng() {
  //   // the setInterval takes 2 parameter, the functions and time
  //   this.fetchLatAndLngInterval = setInterval(() => {this.getIp()}, 1000); // Fetch every 1 second
  // }

  ngOnDestroy(): void {
    this.editor.destroy();
      // clearInterval(this.fetchLatAndLngInterval);
      // if (this.fetchLatAndLngInterval) {
      //   clearInterval(this.fetchLatAndLngInterval); // Clear the interval to prevent memory leaks
      // }
  }

  getIp() {
    this.httpRequest.makeGetRequest('/memo/memgeotemp').subscribe((response)=>{
      console.log(response.data);
      const lat = response.data.lat;
      const lng = response.data.lng;
      const location = `Lat: ${lat}, Lng: ${lng}`;
      this.memoForm.controls['areaName'].setValue(location);
      this.memoForm.reset();
      this.countrySelected = false;
      this.iframeVisible = false;
      // disable input here
      this.memoForm.controls['areaName'].disable();
    }, (error)=>{
      console.log(error);
    })
  }




// FOR THE IP ADDRESS VERIFICATION
  isValidIP(ip_address: string): boolean {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipPattern.test(ip_address);
  }

  dmsToDecimal(dms: string): number {
    const parts = dms.split(/°|'|"| /).filter(part => part);
    const degrees = parseFloat(parts[0]);
    const minutes = parseFloat(parts[1]) / 60;
    const seconds = parseFloat(parts[2]) / 3600;
    const direction = parts[3];

    let decimal = degrees + minutes + seconds;
    if (direction === 'S' || direction === 'W') {
        decimal *= -1;
    }
    return decimal;
}

  // Example of a simple area name validation method
  isValidAreaName(areaName: string): boolean {
    const areaNamePattern = /^[a-zA-Z\s]+$/; // Modify this regex to match valid area names
    return areaNamePattern.test(areaName);
  }


  isValidAreaNameWithState(areaName: string): boolean {
    // Regex to allow area names with optional commas and states (e.g., "Abule Egba, Lagos")
    const areaNameWithStatePattern = /^[a-zA-Z\s]+(?:,\s*[a-zA-Z\s]+)?$/;
    return areaNameWithStatePattern.test(areaName);
  }

    // Validate area name with state (e.g., "Abule Egba, Lagos")
    // if (!this.isValidAreaNameWithState(this.areaName)) {
    //   Toastify({
    //     text: 'Invalid area name or state. Please use the format "Area, State".',
    //     duration: 3000,
    //     gravity: "top",
    //     position: "right",
    //     backgroundColor: "red",
    //   }).showToast();
    //   return;
    // }

  close() {
    this.handleModals.showMother("undefined");
    this.handleModals.toggleCheck("nothing")
    this.memoForm.reset()
  }

  draftMemo(): void {
    if (this.memoForm.valid) {
      this.isLoading = true;
      const memoData = this.memoForm.value;
      console.log(memoData);
      // const memoData = {
      //   title:  this.memoForm.value.title,
      //   memo: this.memoForm.value.memo,
      //   include_signature: this.memoForm.value.memo,
      // };
      if (this.handleModals.show === 'edit_files') {
        // Create the memo object using form values
        const memo = {
          title: this.handleModals?.editMemo?.MemTitle || this.memoForm.value.title,
          memo: this.memoForm.value.memo,
          memId: this.handleModals?.editMemo?.MemUniqueId || this.memoForm.value.MemUniqueId,
          memFold: this.handleModals?.editMemo?.MemFoldId || this.memoForm.value.MemFoldId || null,
        };
        console.log(memo);
        // Make the PATCH request
        this.httpRequest.makePatchRequest('/memo/update', memo).subscribe(
          (response) => {
            console.log(response);
            this.isLoading = false;
            this.memoForm.reset();
            Toastify({
              text: "Memo updated successfully",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "blue",
            }).showToast();
          },
          (error) => {
            console.error('Error updating memo:', error);
            this.isLoading = false;
            Toastify({
              text: `${error}`,
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
          }
        );
      } else {
        // API call for creating a new memo
        this.httpRequest.makePostRequest('/memo/create', memoData).subscribe(
          (response: any) => {
            console.log(response);
            this.isLoading = false;
            this.memId = response.id;
            this.handleModals.setMemId(response.id )
            Toastify({
              text: "Memo created successfully",
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "green",
            }).showToast();
          },
          (error) => {
            console.error('Error saving draft:', error);
            this.isLoading = false;
            Toastify({
              text: `${error}`,
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
          }
        );
      }
    } else {
      console.error('Form is not valid!');
      this.isLoading = false;
      Toastify({
        text: 'Form is not valid',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
  }


  addIP(ip_address: string) {
    // Check if ip_address is provided and valid
    if (!ip_address || !this.isValidIP(ip_address)) {
      Toastify({
        text: 'Please enter a valid IP address.',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    // Check if the IP address is already in the allowed list
    if (this.allowed_ips.includes(ip_address)) {
      Toastify({
        text: 'IP address already exists.',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    } else {
      // Add the IP address to the allowed list
      this.allowed_ips.push(ip_address);
      Toastify({
        text: 'IP address added successfully.',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "blue",
      }).showToast();
    }
    // Clear the input field
    this.memoForm.get('ip_address')?.reset();
  }

  onsubmit() {
    this.isLoading = false;
    if (!this.memId) {
      Toastify({
        text: "please create a memo",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    this.isLoading = true;
    const formValues = { ...this.memoForm.value, ipData: this.allowed_ips, geolocationData: Object.values(this.locationDetails), memId: this.memId, new: this.area_location };
    console.log(formValues);
    // this.createMemo(formValues); 
    this.httpRequest.makePostRequest('/memo/mem_secure_rule/create', formValues).subscribe((response) => {
      console.log(response);
      this.isLoading = false;
      Toastify({
        text: 'success',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "blue",
      }).showToast();
    }, (error) => {
      console.log(error.error.message);
      this.isLoading = false;
      Toastify({
        text: 'something went wrong',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    })
  }

  onCheckboxChange(event: any) {
    // Logic to handle checkbox change if needed
  }

  // FOR AREA 
  // fetchAreaDetails() {
  //   if(!this.areaName){
  //     Toastify({
  //       text: 'Fill in appropriately',
  //       duration: 3000,
  //       gravity: "top",
  //       position: "right",
  //       backgroundColor: "red",
  //     }).showToast();
  //   }
  //   this.areaName = this.memoForm.get('areaName')?.value;
  //   this.area_location.push(this.areaName);
  //   console.log('Area Name:', this.areaName);
  //   if (this.areaName) {
  //     this.httpRequest.fetchAreaDetails(this.areaName).subscribe((data: any) => {
  //           console.log(data);
  //           if (data.results && data.results.length > 0) {
  //             const result = data.results[0].annotations.DMS; // Get the first result
  //             Toastify({
  //               text: 'success',
  //               duration: 3000,
  //               gravity: "top",
  //               position: "right",
  //               backgroundColor: "green",
  //             }).showToast();
  //             this.locationDetails[this.areaName] = {
  //               Lat: this.dmsToDecimal(result.lat).toFixed(6),
  //               Lng: this.dmsToDecimal(result.lng).toFixed(6),
  //             };
  //             console.log(this.locationDetails);
  //           } else {
  //             Toastify({
  //               text: 'No location fetch for this area',
  //               duration: 5000,
  //               gravity: "top",
  //               position: "right",
  //               backgroundColor: "red",
  //             }).showToast();
  //           }
  //         },
  //         error => {
  //           console.error(error);
  //           Toastify({
  //             text: `${error}`,
  //             duration: 3000,
  //             gravity: "top",
  //             position: "right",
  //             backgroundColor: "red",
  //           }).showToast();
  //         }
  //       );
  //       this.memoForm.get('areaName')?.reset(); 
  //   } else {
  //     this.locationDetails = null; // Reset if no area name is provided
  //   }
  // }


  // fetchAreaDetails() {

  //   this.areaName = this.memoForm.get('areaName')?.value;
  
  //   // if (!this.areaName) {
  //   //   Toastify({
  //   //     text: 'Please fill in the area name.',
  //   //     duration: 3000,
  //   //     gravity: "top",
  //   //     position: "right",
  //   //     backgroundColor: "red",
  //   //   }).showToast();
  //   //   return;
  //   // }
  
  //   // Check if the Area address is already in the area_location list
  //   // if (this.area_location.includes(this.areaName)) {
  //   //   Toastify({
  //   //     text: 'Area address already exists.',
  //   //     duration: 3000,
  //   //     gravity: "top",
  //   //     position: "right",
  //   //     backgroundColor: "red",
  //   //   }).showToast();
  //   //   return;
  //   // }
  //   // Check if the area name is valid using a custom validation method
  //   // if (!this.isValidAreaName(this.areaName)) {
  //   //   Toastify({
  //   //     text: 'Invalid area name.',
  //   //     duration: 3000,
  //   //     gravity: "top",
  //   //     position: "right",
  //   //     backgroundColor: "red",
  //   //   }).showToast();
  //   //   return;
  //   // }
  
  //   // Add area name to area_location array
  //   this.area_location.push(this.areaName);
  //   console.log('Area Name:', this.areaName);
  
  //   // Fetch area details
  //   // this.httpRequest.fetchAreaDetails(this.areaName).subscribe(
  //   //   (data: any) => {
  //   //     console.log(data);
  //   //     if (data.results && data.results.length > 0) {
  //   //       const result = data.results[0].annotations.DMS; // Get the first result
  //   //       Toastify({
  //   //         text: 'Location fetched successfully.',
  //   //         duration: 3000,
  //   //         gravity: "top",
  //   //         position: "right",
  //   //         backgroundColor: "blue",
  //   //       }).showToast();
  //   //       this.locationDetails[this.areaName] = {
  //   //         Lat: this.dmsToDecimal(result.lat).toFixed(6),
  //   //         Lng: this.dmsToDecimal(result.lng).toFixed(6),
  //   //       };
  //   //       console.log(this.locationDetails);
  //   //     } else {
  //   //       Toastify({
  //   //         text: 'No location data available for this area.',
  //   //         duration: 5000,
  //   //         gravity: "top",
  //   //         position: "right",
  //   //         backgroundColor: "red",
  //   //       }).showToast();
  //   //     }
  //   //   },
  //   //   error => {
  //   //     console.error(error);
  //   //     Toastify({
  //   //       text: `Error fetching location: ${error.message || error}`,
  //   //       duration: 3000,
  //   //       gravity: "top",
  //   //       position: "right",
  //   //       backgroundColor: "red",
  //   //     }).showToast();
  //   //   }
  //   // );
  
  //   // Reset the areaName field
  //   this.memoForm.get('areaName')?.reset();
  // }
  
  
  // accessPublic(){
  //   alert()
  // }

  // CREATING ACCESS MEMMO
  createMemo(values: any) {
    this.isLoading = false;
    // console.log(values);
    if (!this.memId) {
      Toastify({
        text: "please create a memo",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    this.isLoading = true;
    const memoData = {
      access: values.access,
      memId: this.memId,
      users: [
        {
          phone: values.phone,
          email: values.email,
        },
      ],
    };
    console.log(memoData);
    this.httpRequest.makePostRequest('/memo/access_type/create', memoData).subscribe(
      (response) => {
        console.log(response);
    this.isLoading = false;
        Toastify({
          text: 'success',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "blue",
        }).showToast();
      },
      (error) => {
        console.log(error);
        Toastify({
          text: 'Error saving memo',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      }
    );
  }


  getMemoAttachments() {
    // Implement your logic to fetch memo attachments
    this.httpRequest.makeGetRequest(`/memo/memo_attachment?${this.memId}`).subscribe((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);

    })
  }

  deleteAttachment(id: number) {
    if (confirm('Are you sure you want to delete this attachment?')) {
      this.httpRequest.makeDeleteRequest(`/memo/memo_attachment?id=${this.memId}`).subscribe(
        (response) => {
          console.log('Attachment deleted successfully', response);
          this.getMemoAttachments();
        },
        (error) => {
          console.error('Error deleting attachment', error);
        }
      );
    }
  }
  // uploadLogo.append('memId', this.memId);
  // FILE ATTACHMENT 
  // Create Attachment
  chooseFile() {
    this.fileInput.nativeElement.click();
  }
  fileChangeEvent(event: any): void {
    const uploadLogo = new FormData();
    const image = event.target.files[0];

    if (image) {
      console.log(image);
      uploadLogo.append('image', image, image.name);
      this.httpRequest.makePostRequest('/memo/upload_image', uploadLogo, true).subscribe(
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

  // Implement your logic to handle security type changes
  changeSecurityType(): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'template') {
      this.saveTemplate();
    }
  }

  saveTemplate() {
    this.httpRequest.makeGetRequest('/memo/mem_secure_rule/all').subscribe((response) => {
      console.log(response.data);
      this.template = response.data
      // console.log(this.template);
    })
  }


  // changeFolder(event:Event): void {
  //   const selectedValue = (event.target as HTMLSelectElement).value;
  //   if (selectedValue === 'folder') {
  //     this.selectedFolder();
  //   }
  // }

  // selectedFolder() {
  //   this.httpRequest.makeGetRequest('/dashboard/folder/all').subscribe((response) => {
  //     console.log(response.data);
  //     this.selectedAllFolder = response.data
  //     // console.log(this.template);
  //   })
  // }

  fetchFolders(): void {
    this.httpRequest.makeGetRequest('/dashboard/folder/all').subscribe(
      (response) => {
        this.selectedAllFolder = response.data; // Assuming the data is in `response.data`
      },
      (error) => {
        console.error('Error fetching folders:', error);
      }
    );
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
      this.httpRequest.makePostRequest('/memo/access_type/create', uploadLogo, true).subscribe(
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
    
    // this.httpRequest.makePostRequest('/memo/access_type/create', memoData).subscribe(
    //   (response) => {
    //     console.log(response);
    //     Toastify({
    //       text: 'success',
    //       duration: 3000,
    //       gravity: "top",
    //       position: "right",
    //       backgroundColor: "red",
    //     }).showToast();
    //   },
  //     (error) => {
  //       console.log(error);
  //       Toastify({
  //         text: `${error}`,
  //         duration: 3000,
  //         gravity: "top",
  //         position: "right",
  //         backgroundColor: "red",
  //       }).showToast();
  //     }
  //   );

}
