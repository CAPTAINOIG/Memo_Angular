import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { NewuserComponent } from '../newuser/newuser.component';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { UserdetailComponent } from '../../userdetail/userdetail.component';
import { AuthenticationComponent } from "../authentication/authentication.component";
import { EsignatureComponent } from '../esignature/esignature.component';
import { EditmemoComponent } from '../editmemo/editmemo.component';
import { OtpconfirmationComponent } from '../otpconfirmation/otpconfirmation.component';
import { CreatefolderComponent } from '../createfolder/createfolder.component';

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
  ],
  templateUrl: './sidebarforms.component.html',
  styleUrls: ['./sidebarforms.component.css']
})
export class SidebarformsComponent implements OnInit, OnDestroy, DoCheck {
  @ViewChild('fileInput') fileInput!: ElementRef;
  step: any;
  memoForm: FormGroup;
  qrForm:FormGroup;
  editor: Editor;
  allowed_ips: string[] = [];
  ip_address: string = '';
  location: string | null = null;
  ipAddress: string = '';
  areaName: string = ''
  locationDetails: any = {};
  area_location: string[] = [];
  template: any = [];
  selectedAllFolder: any = [];
  memId: string;
  isUsed: any[] = [];
  isLoading = false;
  

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

  ) {
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
      // change_folder: new FormControl (''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
    });

  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.fetchFolders()
    this.fetchQrCode();

    this.qrForm = this.fb.group({
      qrInput: [{ value: '', disabled: true }]
    });

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
  
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  close() {
    this.handleModals.showMother("undefined");
    this.handleModals.toggleCheck("nothing")
    this.memoForm.reset()
  }


  // DRAFT / CREATE MEMO
  // draftMemo(): void {
  //   if (this.memoForm.valid) {
  //     const memoData = this.memoForm.value;
  //     console.log(memoData);
  //     this.httpRequest.makePostRequest('/memo/create', memoData).subscribe(
  //       (response: any) => {
  //         console.log(response);
  //         this.memId = response.id
  //         // console.log(this.memId);
  //         Toastify({
  //           text: "success",
  //           duration: 3000,
  //           gravity: "top", 
  //           position: "right", 
  //           backgroundColor: "green",
  //         }).showToast();
  //       },

  //       (error) => {
  //         console.error('Error saving draft:', error);
  //         Toastify({
  //           text: `${error}`,
  //           duration: 3000,
  //           gravity: "top", 
  //           position: "right", 
  //           backgroundColor: "red",
  //         }).showToast();
  //       }
  //     );
  //   } else {
  //     console.error('Form is not valid!');
  //     Toastify({
  //       text: 'Form is not valid',
  //       duration: 3000,
  //       gravity: "top", 
  //       position: "right", 
  //       backgroundColor: "red",
  //     }).showToast();
  //   }
  // }

  draftMemo(): void {
    if (this.memoForm.valid) {
      this.isLoading = true;
      const memoData = this.memoForm.value;
      console.log(memoData);
      // Determine the correct API endpoint and action based on the state
      if (this.handleModals.show === 'edit_files') {
        // Create the memo object using form values
        const memo = {
          title: this.handleModals?.editMemo?.MemTitle || this.memoForm.value.title,
          memo: this.memoForm.value.memo,
          memId: this.handleModals?.editMemo?.MemUniqueId || this.memoForm.value.MemUniqueId,
          memFold: this.handleModals?.editMemo?.MemFoldId || this.memoForm.value.MemFoldId || null,
        };

        console.log(memo); // Log the memo object to check its structure

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
              backgroundColor: "green",
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
    const formValues = { ...this.memoForm.value, ipData: this.allowed_ips, geolocationData: Object.values(this.locationDetails), memId: this.memId, new: this.area_location };
    console.log('Form Values:', formValues);
    // this.createMemo(formValues); 
    this.httpRequest.makePostRequest('/memo/mem_secure_rule/create', formValues).subscribe((response) => {
      console.log(response);
      Toastify({
        text: 'success',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "green",
      }).showToast();
    }, (error) => {
      Toastify({
        text: `${error}`,
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
  fetchAreaDetails() {
    this.areaName = this.memoForm.get('areaName')?.value;

    this.area_location.push(this.areaName);
    console.log('Area Name:', this.areaName);
    if (this.areaName) {
      this.httpRequest.fetchAreaDetails(this.areaName)
        .subscribe(
          (data: any) => {
            // console.log(data);
            if (data.results && data.results.length > 0) {
              const result = data.results[0].annotations.DMS; // Get the first result
              Toastify({
                text: 'success',
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
              }).showToast();
              this.locationDetails[this.areaName] = {
                latitude: result.lat,
                longitude: result.lng,
              };
            } else {
              Toastify({
                text: 'No location fetch for this area',
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
              }).showToast();
            }
          },
          error => {
            console.error(error);
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
      this.locationDetails = null; // Reset if no area name is provided
    }
  }

  // CREATING ACCESS MEMMO
  createMemo(values: any) {
    // console.log(values);
    if (!this.memId) {
      Toastify({
        text: "please create a memo",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
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
    // console.log(memoData);
    this.httpRequest.makePostRequest('/memo/access_type/create', memoData).subscribe(
      (response) => {
        console.log(response);
        Toastify({
          text: 'success',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
      },
      (error) => {
        console.log(error);
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

  // getMemo() {
  //   // Implement your logic to fetch memo data
  //   this.httpRequest.makeGetRequest('/memo/single?id=y89356548697887').subscribe((response)=>{
  //     // console.log(response);
  //   }, (error)=>{
  //     console.log(error);

  //   })
  // }

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


  createQrCode(value: any) {
    if(this.qrForm.valid){
      const data = this.qrForm.value
      console.log(data);
    } else {
      Toastify({
        text: "invalid",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    }
  } 

  fetchQrCode(){
    this.httpRequest.makeGetRequest('/memo/get_by_memuniqueid_that_is_not_used').subscribe((response)=>{
      console.log(response);
      this.isUsed = response.data;
      if (this.isUsed?.length > 0) {
        const item = this.isUsed[0];
        this.qrForm?.patchValue({
          qrInput: item?.MemUniqueId
        });
        this.qrForm.get('qrInput')?.disable();
      }
    }, (error)=>{
      console.log(error);
      
    })
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
