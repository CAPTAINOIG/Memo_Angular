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
// import { EditmemoComponent } from '../editmemo/editmemo.component';
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
    // EditmemoComponent,
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
  test: any
  selectedAllFolder: any = [];
  memId: string;
  form: FormGroup;
  createMemoForm: FormGroup;
  isLoading = false;
  qrCodeCheckInterval: any;
  updateMemoMemUniqueId: any;
  showSubmitButton: boolean = false;
  fetchLatAndLng: any;
  fetchLatAndLngInterval: any;
  iframeVisible = false;
  countrySelected = false;
  selectedCountry: string = '';
  metaDataForm: FormGroup;
  metaDataArray: any[] = [];
  memFoldId: any;
  metaDataResult: any;


  memo_attachments = [
    {
      name: "Sample",
      size: "20",
      type: "Images"
    }
  ];

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
        create_as_template: new FormControl(false),
        access: new FormControl(''),
        public: new FormControl(''),
        name: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        metaData: new FormControl(''),
        key: new FormControl(''),
        value: new FormControl(''),
      });
      
      this.form = this.fb.group({
      metaData: new FormControl(''),
      key: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.createMemoForm = this.fb.group({
      access: new FormControl(''),
      public: new FormControl(''),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
    });
  }

  handle(data: any = undefined) {
    this.handleModals.setCreateMemoTabs(data)
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.fetchFolders();
    this.getIp();
  }
  ngDoCheck(): void {
    if (this.handleModals.show == "edit_files" && this.handleModals.check == "nothing") {
      const check = this.handleModals.show == "edit_files"
      this.memoForm.setValue({
        title: check ? this.handleModals?.editMemo?.MemTitle : '',
        memo: check ? this.handleModals?.editMemo?.MemContents : '',
        metaData: '',
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
        key: '',
        value: '',
        public: '',
      })
      this.handleModals.toggleCheck("hello")
    }
  }

  showIframe() {
    this.iframeVisible = true;
  }

  // extractPlainText(memoContent: any): string {
  //   if (!memoContent || typeof memoContent !== 'object' || !memoContent.content) {
  //     return '';
  //   }

  //   let plainText = '';
  //   memoContent.content.forEach((node: any) => {
  //     if (node.type === 'text') {
  //       plainText += node.text || '';
  //     } else if (node.content && Array.isArray(node.content)) {
  //       plainText += this.extractPlainText(node);  // recursive call for nested content
  //     }
  //   });
  //   return plainText.trim();
  // }

  // extractPlainText(memo: { type: string; content: any[] }): string {
  //   if (!memo || !Array.isArray(memo.content)) {
  //     console.error('Invalid memo content:', memo);
  //     return '';
  //   }
  
  //   return memo.content.map((block) => block.text || '').join(' ');
  // }


  extractPlainText(memo: { type: string; content: any[] }): string {
    if (!memo || !Array.isArray(memo.content)) {
      console.error('Invalid memo content:', memo);
      return '';
    }
  
    return memo.content.map((block) => {
      if (typeof block === 'string') return block; 
      if (block.text) return block.text; 
      return '';
    }).join(' ');
  }
  
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  
  

  fetchAreaDetails() {
    this.areaName = this.memoForm.get('areaName')?.value;
    this.area_location.push(this.areaName);
    console.log('Area Name:', this.areaName);
    this.memoForm.get('areaName')?.reset();
  }
  
  
  getIp() {
    this.httpRequest.makeGetRequest('/memo/memgeotemp').subscribe((response) => {
      // console.log(response)
      const lat = response.data.lat;
      const lng = response.data.lng;
      const location = `Lat: ${lat}, Lng: ${lng}`;
      // console.log(location)
      this.memoForm.controls['areaName'].setValue(location);
      // this.memoForm.reset();
      this.countrySelected = false;
      this.iframeVisible = false;
      // this.memoForm.controls['areaName'].disable();
    }, (error) => {
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

  isValidAreaName(areaName: string): boolean {
    const areaNamePattern = /^[a-zA-Z\s]+$/;
    return areaNamePattern.test(areaName);
  }

  // Regex to allow area names with optional commas and states (e.g., "Abule Egba, Lagos")
  isValidAreaNameWithState(areaName: string): boolean {
    const areaNameWithStatePattern = /^[a-zA-Z\s]+(?:,\s*[a-zA-Z\s]+)?$/;
    return areaNameWithStatePattern.test(areaName);
  }

  close() {
    this.handleModals.showMother("undefined");
    this.handleModals.toggleCheck("nothing")
    this.memoForm.reset()
  }

  draftMemo(): void {
    if (!this.memoForm.valid) {
      Toastify({
        text: 'Form is not valid',
        duration: 3000,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#FF0000',
      }).showToast();
      return;
    }
  
    this.isLoading = true;
  
    // const memoData = { ...this.memoForm.value, memFold: this.memFoldId };
    // console.log('Original memoData:', memoData);

    const memoData = {
    title: this.memoForm.value.title,
    memo: this.memoForm.value.memo,
    MemUniqueId: this.memId,
    include_signature: !!this.memoForm.value.include_signature,
    memFold: Number(this.memFoldId) 
  }
  
    if (memoData.memo && memoData.memo.type === 'doc') {
      memoData.memo = this.extractPlainText(memoData.memo);
    }
  
    // console.log(memoData.memo);
  
    if (this.handleModals.show === 'edit_files') {
      const memo = {
        MemTitle: this.handleModals?.editMemo?.MemTitle || memoData.title,
        memo: memoData.memo,
        memId: this.handleModals?.editMemo?.MemUniqueId || memoData.MemUniqueId,
        memFold: this.handleModals?.editMemo?.MemFoldId || memoData.memFold || null,
      };
      console.log(memo);
      this.httpRequest.makePatchRequest('/memo/update', memo).subscribe(
        (response) => {
          console.log(response);
          this.isLoading = false;
          this.memoForm.reset();
          Toastify({
            text: 'Memo updated successfully',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#0000FF',
          }).showToast();
        },
        (error) => {
          console.error('Error updating memo:', error);
          this.isLoading = false;
          Toastify({
            text: `${error.error.message || 'An error occurred'}`,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#FF0000',
          }).showToast();
        }
      );
    } else {
      // console.log(memoData);
      this.httpRequest.makePostRequest('/memo/create', memoData).subscribe(
        (response: any) => {
          console.log('Create response:', response);
          this.isLoading = false;
          this.memId = response.id;
          this.handleModals.setMemId(response.id);
          Toastify({
            text: 'Memo created successfully',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#0000FF',
          }).showToast();
        },
        (error) => {
          console.error('Error saving draft:', error);
          this.isLoading = false;
          Toastify({
            text: `${error.error.message || 'An error occurred'}`,
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#FF0000',
          }).showToast();
        }
      );
    }
  }
  

  addIP(ip_address: string) {
    if (!ip_address || !this.isValidIP(ip_address)) {
      Toastify({
        text: 'Please enter a valid IP address.',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
      return;
    }
    if (this.allowed_ips.includes(ip_address)) {
      Toastify({
        text: 'IP address already exists.',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
    } else {
      this.allowed_ips.push(ip_address);
      Toastify({
        text: 'IP address added successfully.',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#0000FF",
      }).showToast();
    }
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
        backgroundColor: "#FF0000",
      }).showToast();
      return;
    }
    this.isLoading = true;
    const formValues = { ...this.memoForm.value, data:this.test, ipData: this.allowed_ips, geolocationData: Object.values(this.locationDetails), memId: this.memId, new: this.area_location, metaData: this.metaDataArray };
    console.log(formValues);
    this.httpRequest.makePostRequest('/memo/mem_secure_rule/create', formValues).subscribe((response) => {
      console.log(response);
      this.isLoading = false;
      Toastify({
        text: 'success',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#0000FF",
      }).showToast();
    }, (error) => {
      console.log(error.error.message);
      this.isLoading = false;
      Toastify({
        text: 'something went wrong',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
    })
  }

  onCheckboxChange(event: any) {
  }

  createMemo() {
    this.isLoading = false;
    if (!this.memId) {
      Toastify({
        text: "please create a memo",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
      return;
    }

    if (!this.createMemoForm.valid) {
      Toastify({
        text: "Form is not valid valid",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
      return;
    };

    this.isLoading = true;
    const memoData = {
      access: this.createMemoForm.get('access')?.value,
      memId: this.memId,
      users: [
        {
          phone: this.createMemoForm.get('phone')?.value,
          email: this.createMemoForm.get('email')?.value,
        },
      ],
      // name: this.createMemoForm.get('name')?.value,
    };
    this.httpRequest.makePostRequest('/memo/access_type/create', memoData).subscribe(
      (response) => {
        console.log(response);
        this.isLoading = false;
        Toastify({
          text: 'success',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#0000FF",
        }).showToast();
      },
      (error) => {
        console.log(error);
        Toastify({
          text: 'Error saving memo',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      }
    );
  }



  draftMetaData() {
    if (!this.memId) {
      Toastify({
        text: "please create a memo",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
      return;
    }
    if (!this.form.valid) {
      Toastify({
        text: "Please fill all the fields",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
      return;
    }
    const values = this.form.value;
    this.metaDataArray.push(values);
    console.log('Form submitted:', values);
    // this.form.reset();
    const meta = {
      memId: this.memId,
      "data": {
        key: values.key,
        value: values.value,
      }
    }
    this.httpRequest.makePostRequest('/memo/metadata', meta).subscribe(
      (response) => {
        console.log(response);
        Toastify({
          text: "Meta Data added successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#0000FF",
        }).showToast();
        // this.memoForm.reset()
        this.memoForm.controls['key'].reset();
        this.memoForm.controls['value'].reset();
        this.isLoading = false;
        this.fetchMetaData();
      },
      (error) => {
        Toastify({
          text: 'Error fetching metadata',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      })
  }

  fetchMetaData(): void {
    const url = `/memo/metadata/?memId=${encodeURIComponent(this.memId)}`;

    this.httpRequest.makeGetRequest(url).subscribe(
      (response) => {
        this.metaDataResult = response.data;
        // console.log(this.metaDataResult);
      },
      (error) => {
        Toastify({
          text: 'Error fetching metadata',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      }
    );
  }

  deleteMetaData(key: number) {
    // console.log(key);
    const url = `/memo/metadata/?memId=${encodeURIComponent(this.memId)}&key=${encodeURIComponent(key)}`;

    this.httpRequest.makeDeleteRequest(url).subscribe(
      (response) => {
        this.metaDataResult = response.data;
        Toastify({
          text: 'success',
          duration: 3000,
          position: 'top',
          backgroundColor: 'linear-gradient(to right, #0000FF, #0000FF)',
          stopOnFocus: true,
          className: 'bg-white text-dark',
          style: {
            borderRadius: '8px',
            fontFamily: 'Helvetica Neue',
            fontWeight: 'bold',
            padding: '25px',
            margin: '25px',
          },
        }).showToast();
      },
      (error) => {
        Toastify({
          text: 'Error fetching metadata',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      }
    );
  }


  getMemoAttachments() {
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
    })
  }

  fetchFolders(): void {
    this.httpRequest.makeGetRequest('/dashboard/folder/all').subscribe(
      (response) => {
        // console.log(response.data[0].Id);
        this.selectedAllFolder = response.data;
        this.memFoldId = response.data[0].Id;
      },
      (error) => {
        console.error('Error fetching folders:', error);
      }
    );
  }

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
  
  }

