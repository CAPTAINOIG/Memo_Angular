// import { CommonModule } from '@angular/common';
// import { Component, ElementRef, OnDestroy, OnInit, ViewChild, DoCheck } from '@angular/core';
// import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { NgxEditorModule, Editor } from 'ngx-editor';
// import { ServicesidebarService } from '../../service/servicesidebar.service';
// import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
// import { NewuserComponent } from '../newuser/newuser.component';
// import Toastify from 'toastify-js';
// import "toastify-js/src/toastify.css";
// import { UserdetailComponent } from '../../userdetail/userdetail.component';
// import { AuthenticationComponent } from "../authentication/authentication.component";
// import { EsignatureComponent } from '../esignature/esignature.component';
// import { EditmemoComponent } from '../editmemo/editmemo.component';

// @Component({
//   selector: 'app-sidebarforms',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     NgxEditorModule,
//     NewuserComponent,
//     UserdetailComponent,
//     AuthenticationComponent,
//     EsignatureComponent,
//     EditmemoComponent
//   ],
//   templateUrl: './sidebarforms.component.html',
//   styleUrls: ['./sidebarforms.component.css']
// })
// export class SidebarformsComponent implements OnInit, OnDestroy, DoCheck {
//   @ViewChild('fileInput') fileInput!: ElementRef;
//   step: any;
//   memoForm: FormGroup;
//   editor: Editor;
//   allowed_ips: string[] = [];
//   ip_address: string = '';
//   location: string | null = null;
//   ipAddress: string = '';
//   areaName: string = ''
//   locationDetails: any = {};
//   area_location: string[] = [];
//   template: any = [];
//   memId: string = '';
//   memo_attachments = [
//     {
//       name: "Sample",
//       size: "20",
//       type: "Images"
//     }
//   ];

//   constructor(
//     public handleModals: ServicesidebarService,
//     private httpRequest: HttpRequestService,
//     private fb: FormBuilder
//   ) {
//     this.memoForm = new FormGroup({
//       title: new FormControl('',
//         Validators.required),
//       memo: new FormControl('',
//         Validators.required),
//       include_signature: new FormControl(false),
//       security_type: new FormControl(''),
//       secureByEmailOtp: new FormControl(false),
//       secureBySmsOtp: new FormControl(false),
//       secureByIp: new FormControl(false),
//       secureByGeoLocation: new FormControl(false),
//       areaName: new FormControl(''),
//       ip_address: new FormControl(''),
//       create_as_template: new FormControl(false),
//       access: new FormControl(''),
//       name: new FormControl(''),
//       email: new FormControl(''),
//       phone: new FormControl(''),
//     });
//   }

//   ngOnInit(): void {
//     this.editor = new Editor();
//   }

//   ngDoCheck(): void {
//     if (this.handleModals.show === "edit_files" && this.handleModals.check === "nothing") {
//       const editMemo = this.handleModals?.editMemo || {};
//       this.memoForm.setValue({
//         title: editMemo.MemTitle || '',
//         memo: editMemo.MemContents || '',
//         include_signature: false,
//         security_type: '',
//         secureByEmailOtp: false,
//         secureBySmsOtp: false,
//         secureByIp: false,
//         secureByGeoLocation: false,
//         areaName: '',
//         ip_address: '',
//         create_as_template: false,
//         access: '',
//         name: '',
//         email: '',
//         phone: '',
//       });
//       this.handleModals.toggleCheck("hello");
//     }
//   }

//   ngOnDestroy(): void {
//     this.editor.destroy();
//   }

//   close() {
//     this.handleModals.showMother("undefined");
//     this.handleModals.toggleCheck("nothing");
//     this.memoForm.reset(); // Reset the form when closing the modal
//   }

//   draftMemo(): void {
//     if (this.memoForm.valid) {
//       const memoData = this.memoForm.value;

//       if (this.handleModals.show === 'edit_files') {
//         const memo = {
//           title: this.handleModals?.editMemo?.MemTitle || this.memoForm.value.title,
//           memo: this.memoForm.value.memo,
//           memId: this.handleModals?.editMemo?.MemUniqueId || this.memoForm.value.MemUniqueId,
//           memFold: this.handleModals?.editMemo?.MemFoldId || this.memoForm.value.MemFoldId || null,
//         };

//         this.httpRequest.makePatchRequest('/memo/update', memo).subscribe(
//           (response) => {
//             this.memoForm.reset();
//             Toastify({
//               text: "Memo updated successfully",
//               duration: 3000,
//               gravity: "top",
//               position: "right",
//               backgroundColor: "green",
//             }).showToast();
//           },
//           (error) => {
//             console.error('Error updating memo:', error);
//             Toastify({
//               text: `${error}`,
//               duration: 3000,
//               gravity: "top",
//               position: "right",
//               backgroundColor: "red",
//             }).showToast();
//           }
//         );
//       } else {
//         this.httpRequest.makePostRequest('/memo/create', memoData).subscribe(
//           (response: any) => {
//             this.memId = response.id;
//             Toastify({
//               text: "Memo created successfully",
//               duration: 3000,
//               gravity: "top",
//               position: "right",
//               backgroundColor: "green",
//             }).showToast();
//           },
//           (error) => {
//             console.error('Error saving draft:', error);
//             Toastify({
//               text: `${error}`,
//               duration: 3000,
//               gravity: "top",
//               position: "right",
//               backgroundColor: "red",
//             }).showToast();
//           }
//         );
//       }
//     } else {
//       console.error('Form is not valid!');
//       Toastify({
//         text: 'Form is not valid',
//         duration: 3000,
//         gravity: "top",
//         position: "right",
//         backgroundColor: "red",
//       }).showToast();
//     }
//   }

//   addIP(ip_address: string) {
//     if (ip_address && !this.allowed_ips.includes(ip_address)) {
//       this.allowed_ips.push(ip_address);
//       this.ip_address = '';
//     } else {
//       console.warn('IP address already exists or is invalid.');
//       Toastify({
//         text: 'IP address already exists or is invalid.',
//         duration: 3000,
//         gravity: "top",
//         position: "right",
//         backgroundColor: "red",
//       }).showToast();
//     }
//   }

//   onsubmit() {
//     const formValues = { ...this.memoForm.value, ipData: this.allowed_ips, geolocationData: Object.values(this.locationDetails), memId: this.memId, new: this.area_location };
//     this.httpRequest.makePostRequest('/memo/mem_secure_rule/create', formValues).subscribe(
//       (response) => {
//         Toastify({
//           text: 'success',
//           duration: 3000,
//           gravity: "top",
//           position: "right",
//           backgroundColor: "green",
//         }).showToast();
//       },
//       (error) => {
//         Toastify({
//           text: `${error}`,
//           duration: 3000,
//           gravity: "top",
//           position: "right",
//           backgroundColor: "red",
//         }).showToast();
//       }
//     );
//   }

//   fetchAreaDetails() {
//     this.areaName = this.memoForm.get('areaName')?.value;

//     this.area_location.push(this.areaName);
//     if (this.areaName) {
//       this.httpRequest.fetchAreaDetails(this.areaName).subscribe(
//         (data: any) => {
//           if (data.results && data.results.length > 0) {
//             const result = data.results[0].annotations.DMS;
//             Toastify({
//               text: 'success',
//               duration: 3000,
//               gravity: "top",
//               position: "right",
//               backgroundColor: "green",
//             }).showToast();
//             this.locationDetails[this.areaName] = {
//               latitude: result.lat,
//               longitude: result.lng,
//             };
//           } else {
//             Toastify({
//               text: 'No location fetch for this area',
//               duration: 3000,
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
//     } else {
//       this.locationDetails = null;
//     }
//   }

//   createMemo(values: any) {
//     if (!this.memId) {
//       Toastify({
//         text: "please create a memo",
//         duration: 3000,
//         gravity: "top",
//         position: "right",
//         backgroundColor: "red",
//       }).showToast();
//     }
//     const memoData = {
//       memId: this.memId,
//       title: values.title,
//       memo: values.memo,
//       ip_address: values.ip_address,
//       security_type: values.security_type,
//       geoLocation: this.locationDetails,
//       allowed_ips: this.allowed_ips
//     };
//     this.httpRequest.makePostRequest('/memo/create', memoData).subscribe(
//       (response) => {
//         this.memoForm.reset();
//         Toastify({
//           text: 'Memo created successfully',
//           duration: 3000,
//           gravity: "top",
//           position: "right",
//           backgroundColor: "green",
//         }).showToast();
//       },
//       (error) => {
//         Toastify({
//           text: `${error}`,
//           duration: 3000,
//           gravity: "top",
//           position: "right",
//           backgroundColor: "red",
//         }).showToast();
//       }
//     );
//   }
// }
