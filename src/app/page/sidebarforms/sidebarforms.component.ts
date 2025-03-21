import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges, DoCheck, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, Form } from '@angular/forms';
import { NgxEditorModule, Editor } from 'ngx-editor';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { NewuserComponent } from '../newuser/newuser.component';
import Toastify from 'toastify-js';
import 'quill-better-table/dist/quill-better-table.css';


import { UserdetailComponent } from '../../userdetail/userdetail.component';
import { AuthenticationComponent } from "../authentication/authentication.component";
import { EsignatureComponent } from '../esignature/esignature.component';
// import { EditmemoComponent } from '../editmemo/editmemo.component';
import { OtpconfirmationComponent } from '../otpconfirmation/otpconfirmation.component';
import { CreatefolderComponent } from '../createfolder/createfolder.component';
import { CreateqrcodeComponent } from '../../createqrcode/createqrcode.component';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import QuillBetterTable from 'quill-better-table';
import { HttpClient } from '@angular/common/http';


Quill.register({
  'modules/better-table': QuillBetterTable
}, true);

@Component({
  selector: 'app-sidebarforms',
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
    CreateqrcodeComponent,
    QuillModule,
  ],
  templateUrl: './sidebarforms.component.html',
  styleUrls: ['./sidebarforms.component.css'],
  standalone: true,
})
export class SidebarformsComponent implements OnInit, OnDestroy, DoCheck {
  isAdmin = JSON.parse(localStorage.getItem('isAdmin') ?? 'false')
  @Output() closeModa = new EventEmitter<void>();
  @Output() uploadComplete = new EventEmitter<File>();


  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  step: any;
  memoForm: FormGroup;
  fullMemo = false;
  createMetaData = false;
  editUserMemo = false
  editor: Editor;
  allowed_ips: string[] = [];
  ip_address: string = '';
  location: string | null = null;
  ipAddress: string = '';
  areaName: string = '';
  locationDetails: any = {};
  area_location: { lat: any; lng: any }[] = [];
  template: any = [];
  test: any
  selectedAllFolder: any = [];
  memId: string;
  form: FormGroup;
  createMemoForm: FormGroup;
  isLoading = false;
  isLoadingApprove = false;
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
  isMetaLoader = false;
  secureBySmsOtp = false;
  metaData = true;
  otpSent = false;
  otpForm: FormGroup;
  submittedOtp = '';
  isSmsLoading = false;
  isMetaDeleteLoader = false;
  showModal = false;
  base64Image: string | null = null;

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
    private fb: FormBuilder,
    private folderService: ServicesidebarService,
    private fileService: ServicesidebarService,
    private http: HttpClient,
  ) {
    this.memoForm = new FormGroup({
      memoType: new FormControl(),
      memoDataType: new FormControl(),
      memoCode: new FormControl(),
      title: new FormControl('', Validators.required),
      memo: new FormControl('', Validators.required),
      memFoldId: new FormControl('', Validators.required),
      include_signature: new FormControl(false),
      staff: new FormControl(''),
      security_type: new FormControl(''),
      secureByEmailOtp: new FormControl(false),
      secureBySmsOtp: new FormControl(false),
      secureByIp: new FormControl(false),
      secureByGeoLocation: new FormControl(false),
      areaName: new FormControl(''),
      ip_address: new FormControl(''),
      create_as_template: new FormControl(false),
      access: new FormControl(''),
      accessType: new FormControl(''),
      public: new FormControl(''),
      name: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      groupEmail: new FormControl(''),
      metaData: new FormControl(true),
    });

    this.form = this.fb.group({
      metaData: new FormControl(true),
      key: ['', Validators.required],
      value: ['', Validators.required],
    });

    this.otpForm = this.fb.group({
      phoneNumber: new FormControl('', Validators.required),
    })

    this.createMemoForm = this.fb.group({
      access: new FormControl(''),
      accessType: new FormControl(''),
      public: new FormControl(''),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      groupEmail: new FormControl('', Validators.required),
    });
  }

  handle(data: any = undefined) {
    this.handleModals.setCreateMemoTabs(data)
  }

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
      // ['table']                                           
    ],
    clipboard: {
      matchVisual: false,
    },
    'better-table': {
      operationMenu: {
        items: {
          unmergeCells: {
            text: 'Unmerge Cells'
          }
        }
      }
    }
  };

  ngOnInit(): void {
    this.editor = new Editor();
    this.fetchFolders();
    this.getIp();
    // this.generateMemoCode();

    this.folderService.refreshFolder$.subscribe(shouldRefresh => {
      if (shouldRefresh) {
        this.fetchFolders();
      }
    });
  };

  GenerateFullMemo() {
    this.fullMemo = true;
    this.createMetaData = false;
  }

  CretaeMetaData() {
    this.createMetaData = true;
    this.fullMemo = false;
  }

  EditFullMemo() {
    this.fullMemo = true;
    this.createMetaData = false;
    this.editUserMemo = true;
  }

  reset() {
    this.fullMemo = false;
    this.createMetaData = false;
    this.editUserMemo = false;
    this.metaDataResult = [];
  }

  ngDoCheck(): void {
    if (this.handleModals.show == "edit_files" && this.handleModals.check == "nothing") {
      const check = this.handleModals.show == "edit_files"
      this.memoForm.patchValue({
        memoType: check ? this.handleModals?.editMemo?.MemTitle : '',
        memoDataType: check ? this.handleModals?.editMemo?.MemTitle : '',
        memoCode: check ? this.handleModals?.editMemo?.MemCode : '',
        title: check ? this.handleModals?.editMemo?.MemTitle : '',
        memo: check ? this.handleModals?.editMemo?.MemContents : '',
        memFoldId: check ? this.handleModals?.editMemo?.MemFoldId : '',
        staff: check ? this.handleModals?.editMemo?.Staff : '',
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
        accessType: '',
        name: '',
        email: '',
        phone: '',
        groupEmail: '',
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

  // fetchAreaDetails() {
  //   this.areaName = this.memoForm.get('areaName')?.value;
  //   this.area_location.push(this.areaName);
  //   console.log('Area Name:', this.areaName);
  //   this.memoForm.get('areaName')?.reset();
  // }


  getIp() {
    this.httpRequest.makeGetRequest('/memo/memgeotemp').subscribe((response) => {
      const lat = response.data.lat;
      const lng = response.data.lng;

      this.area_location = [{ lat: lat, lng: lng }];

      const location = `Lat: ${lat}, Lng: ${lng}`;

      this.memoForm.controls['areaName'].setValue(location);
      // this.memoForm.reset();
      this.countrySelected = false;
      this.iframeVisible = false;
      this.memoForm.controls['areaName'].disable();
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

  isValidAreaNameWithState(areaName: string): boolean {
    const areaNameWithStatePattern = /^[a-zA-Z\s]+(?:,\s*[a-zA-Z\s]+)?$/;
    return areaNameWithStatePattern.test(areaName);
  }

  close() {
    this.handleModals.showMother("undefined");
    this.handleModals.toggleCheck("nothing")
    this.memoForm.reset()
  }

  // generateMemoCode() {
  //   const randomId = 'CCA/' + Math.floor(1000000000 + Math.random() * 9000000000);
  //   this.memoForm.patchValue({ memoCode: randomId });
  // }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.closeModa.emit();
    this.showModal = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.base64Image = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      console.log(this.selectedFile);
      this.uploading = true;
      setTimeout(() => {
        this.uploading = false;
        this.uploadComplete.emit(this.selectedFile as File);
      }, 1500);
    }
  }

  draftMemo(event: any): void {
    if (this.fullMemo) {
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
    }
    const memoData = {
      title: this.memoForm.value.title,
      // MemTitle: this.memoForm.value.title,
      memo: this.memoForm.value.memo,
      MemUniqueId: this.memId,
      include_signature: !!this.memoForm.value.include_signature,
      memFold: Number(this.memoForm.value.memFoldId),
      isPublished: event.submitter.value === 'save' ? 0 : 1,
      memoType: this.memoForm.value.memoType,
      staff: this.memoForm.value.staff,
      memoCode: this.memoForm.value.memoCode
    }

    if (memoData.memo && memoData.memo.type === 'doc') {
      memoData.memo = this.extractPlainText(memoData.memo);
    };

    if (this.handleModals.show === 'edit_files' && event.submitter.value === 'save') {
      const memo = {
        title: this.memoForm.value.title || this.handleModals?.editMemo?.MemTitle,
        memo: this.memoForm.value.memo,
        memId: this.handleModals?.editMemo?.MemUniqueId,
        memFold: this.handleModals?.editMemo?.MemFoldId,
        isPublished: event.submitter.value === 'save' ? 0 : 1,
        memoType: this.memoForm.value.memoType,
        staff: this.memoForm.value.staff,
        memoCode: this.memoForm.value.memoCode
      };
      this.isLoading = true;
      this.httpRequest.makePatchRequest('/memo/update', memo).subscribe(
        (response) => {
          this.isLoading = false;
          this.memoForm.reset();
          Toastify({
            text: 'Memo updated successfully',
            duration: 3000,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#0000FF',
          }).showToast();
          this.fileService.triggerFileRefresh();
          if (this.createMetaData) {
            this.draftMetaData();
          }
        },
        (error) => {
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
    } else if (this.handleModals.show === 'edit_files' && event.submitter.value === 'approve') {
      this.isLoadingApprove = true;
      this.httpRequest.makePatchRequest('/memo/publsh_memo', { "memId": this.handleModals?.editMemo?.Id, 'publish': 'pending' }).subscribe((response) => {
        this.isLoadingApprove = false;
        Toastify({
          text: 'Memo submitted successfully',
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#0000FF',
        }).showToast();
        this.fileService.triggerFileRefresh();
        if (this.createMetaData) {
          this.draftMetaData();
        }
        this.memoForm.reset();
      }, (error) => {
        this.isLoadingApprove = false;
        Toastify({
          text: `${error.error.message || 'An error occurred'}`,
          duration: 3000,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#FF0000',
        }).showToast();
      })
    }
    else if (this.handleModals.show === 'create_memo') {
      this.isLoading = true;
      this.httpRequest.makePostRequest('/memo/create', memoData).subscribe(
        (response: any) => {
          // console.log(response)
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
          this.fileService.triggerFileRefresh();
          if (this.createMetaData) {
            this.draftMetaData();
          }
          // this.handleModals.showMother("undefined");
          this.memoForm.reset();
        },
        (error) => {
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
    };
  };


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
    if (this.fullMemo && !this.form.valid) {
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
    const meta = {
      memId: this.memId,
      "data": {
        key: values.key,
        value: values.value,
      }
    }
    this.isMetaLoader = true;
    this.httpRequest.makePostRequest('/memo/metadata', meta).subscribe(
      (response) => {
        Toastify({
          text: "Meta Data added successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#0000FF",
        }).showToast();
        // this.memoForm.reset()
        this.form.controls['key'].reset();
        this.form.controls['value'].reset();
        this.isLoading = false;
        this.fetchMetaData();
        this.isMetaLoader = false;
      },
      (error) => {
        this.isMetaLoader = false;
        Toastify({
          text: 'Error fetching metadata',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      })
  };

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
  };

  deleteMetaData(key: number) {
    this.isMetaDeleteLoader = true;
    const keyString = String(key);
    const url = `/memo/metadata/?memId=${encodeURIComponent(this.memId)}&key=${encodeURIComponent(keyString)}`;
    this.httpRequest.makeDeleteRequest(url).subscribe(
      (response) => {
        this.isMetaDeleteLoader = false;
        this.metaDataResult = response.data;
        Toastify({
          text: 'success',
          duration: 3000,
          position: 'top',
          backgroundColor: "#0000FF",
        }).showToast();
      },
      (error) => {
        this.isMetaDeleteLoader = false;
        Toastify({
          text: 'Error Deleting metadata',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#FF0000",
        }).showToast();
      }
    );
  };

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
  };


  // sendOtp() {
  //   if (!this.otpForm.valid) {
  //     Toastify({
  //       text: 'Please fill all the fields',
  //       duration: 3000,
  //       gravity: 'top',
  //       position: 'right',
  //       style: { background: '#FF0000' },
  //     }).showToast();
  //     return;
  //   }
  //   const payload = this.otpForm.value;
  //   this.isSmsLoading = true;
  //   this.http.post('https://lendnode.creditclan.com/gateway/send_external_sms', {phone: payload.phoneNumber}).subscribe((response) => {
  //         this.isSmsLoading = false;
  //         Toastify({
  //           text: 'OTP sent successfully',
  //           duration: 3000,
  //           gravity: 'top',
  //           position: 'right',
  //           style: { background: '#0000FF' },
  //         }).showToast();
  //         this.otpSent = true;
  //       },
  //       (error) => {
  //         this.isSmsLoading = false;
  //         Toastify({
  //           text: 'Error sending OTP',
  //           duration: 3000,
  //           gravity: 'top',
  //           position: 'right',
  //           style: { background: '#FF0000' },
  //         }).showToast();
  //       }
  //     );
  // }

  // verifyOtp() {
  //   const payload = {
  //     phoneNumber: this.otpForm.value.phoneNumber,
  //     otp: this.submittedOtp,
  //   };

  //   this.http.post('/memo/otp/verify', payload).subscribe((response) => {
  //       Toastify({
  //         text: 'OTP verified successfully',
  //         duration: 3000,
  //         gravity: 'top',
  //         position: 'right',
  //         style: { background: '#0000FF' },
  //       }).showToast();
  //     },
  //     (error) => {
  //       Toastify({
  //         text: 'Error verifying OTP',
  //         duration: 3000,
  //         gravity: 'top',
  //         position: 'right',
  //         style: { background: '#FF0000' },
  //       }).showToast();
  //     }
  //   );
  // }

  // onPhoneNumberEntered() {
  //   if (this.otpForm.get('phoneNumber')?.invalid) {
  //     return;
  //   }

  //   this.phoneNumber = this.otpForm.get('phoneNumber')?.value;

  //   this.http.post('https://your-backend-api.com/send-otp', { phoneNumber: this.phoneNumber })
  //     .subscribe({
  //       next: () => {
  //         this.otpSent = true;
  //         alert("OTP has been sent to your phone.");
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         alert("Failed to send OTP. Please try again.");
  //       }
  //     });
  // }

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
    const formValues = { ...this.memoForm.value, data: this.test, ipData: this.allowed_ips, geolocationData: this.area_location, memId: this.memId, new: this.area_location, metaData: this.metaDataArray };
    this.httpRequest.makePostRequest('/memo/mem_secure_rule/create', formValues).subscribe((response) => {
      this.isLoading = false;
      Toastify({
        text: 'success',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#0000FF",
      }).showToast();
    }, (error) => {
      this.isLoading = false;
      Toastify({
        text: 'something went wrong',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
    })
  };

  onCheckboxChange(event: any) {
  };

  // createMemo() {
  //   this.isLoading = false;
  //   if (!this.memId) {
  //     Toastify({
  //       text: "please create a memo",
  //       duration: 3000,
  //       gravity: "top",
  //       position: "right",
  //       backgroundColor: "#FF0000",
  //     }).showToast();
  //     return;
  //   }

  //   if (!this.createMemoForm.valid) {
  //     Toastify({
  //       text: "Form is not valid valid",
  //       duration: 3000,
  //       gravity: "top",
  //       position: "right",
  //       backgroundColor: "#FF0000",
  //     }).showToast();
  //     return;
  //   };

  //   this.isLoading = true;

  //   const memoData = {
  //     access: this.createMemoForm.get('access')?.value,
  //     memId: this.memId,
  //     users: [
  //       {
  //         phone: this.createMemoForm.get('phone')?.value,
  //         email: this.createMemoForm.get('email')?.value,
  //         group: this.createMemoForm.get('groupEmail')?.value,
  //       },
  //     ],
  //     // name: this.createMemoForm.get('name')?.value,
  //   };

  //   console.log(memoData)

  //   this.httpRequest.makePostRequest('/memo/access_type/create', memoData).subscribe(
  //     (response) => {
  //       console.log(response);
  //       this.isLoading = false;
  //       Toastify({
  //         text: 'success',
  //         duration: 3000,
  //         gravity: "top",
  //         position: "right",
  //         backgroundColor: "#0000FF",
  //       }).showToast();
  //     },
  //     (error) => {
  //       console.log(error);
  //       this.isLoading = false;
  //       Toastify({
  //         text: 'Error saving memo',
  //         duration: 3000,
  //         gravity: "top",
  //         position: "right",
  //         backgroundColor: "#FF0000",
  //       }).showToast();
  //     }
  //   );
  // };

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
        text: "Form is not valid",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF0000",
      }).showToast();
      this.isLoading = false;
      return;
    }

    const access = this.createMemoForm.get('access')?.value;
    const accessType = this.createMemoForm.get('accessType')?.value;

    let memoData: any = {
      access: access,
      memId: this.memId,
      users: []
    };

    if (access === 'public') {
      // No additional data required
    }

    // Restricted Access
    if (access === 'restricted') {
      if (accessType === 'individual') {
        memoData.users.push({
          name: this.createMemoForm.get('name')?.value,
          email: this.createMemoForm.get('email')?.value,
          phone: this.createMemoForm.get('phone')?.value
        });
      }
      else if (accessType === 'group') {
        memoData.users.push({
          groupEmail: this.createMemoForm.get('groupEmail')?.value
        });
      }
    }

    this.httpRequest.makePostRequest('/memo/access_type/create', memoData).subscribe(
      (response) => {
        this.isLoading = false;
        Toastify({
          text: 'Success',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "#0000FF",
        }).showToast();
      },
      (error) => {
        this.isLoading = false;
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


  getMemoAttachments() {
    this.httpRequest.makeGetRequest(`/memo/memo_attachment?${this.memId}`).subscribe((response) => {
    }, (error) => {

    })
  };

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
  };

  chooseFile() {
    this.fileInput.nativeElement.click();
  };

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
  };

  changeSecurityType(): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue === 'template') {
      this.saveTemplate();
    }
  };

  saveTemplate() {
    this.httpRequest.makeGetRequest('/memo/mem_secure_rule/all').subscribe((response) => {
      this.template = response.data
    })
  };

  fetchFolders(): void {
    this.httpRequest.makeGetRequest('/dashboard/folder/all').subscribe(
      (response) => {
        // console.log(response.data[0].Id);
        this.selectedAllFolder = response.data;
        // console.log(this.selectedAllFolder)
        // this.memFoldId = response.data[0].Id;
        // console.log(this.memFoldId)
      },
      (error) => {
        // console.error('Error fetching folders:', error);
      }
    );
  };

  selectFile() {
    this.fileInput.nativeElement.click();
  };

  handleChangeEvent(event: any): void {
    const uploadLogo = new FormData();
    const image = event.target.files[0];

    if (image) {
      uploadLogo.append('image', image, image.name);
      this.httpRequest.makePostRequest('/memo/access_type/create', uploadLogo, true).subscribe(
        (response) => {
        },
        (error) => {
        }
      );
    }
    else {
      console.warn('No file selected.');
    }
  };
}

