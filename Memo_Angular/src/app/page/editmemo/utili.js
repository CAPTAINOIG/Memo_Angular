// import { CommonModule } from '@angular/common';
// import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ServicesidebarService } from '../../service/servicesidebar.service';
// import { NgxEditorModule, Editor } from 'ngx-editor';
// import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
// import Toastify from 'toastify-js';
// import "toastify-js/src/toastify.css";

// @Component({
//   selector: 'app-editmemo',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxEditorModule],
//   templateUrl: './editmemo.component.html',
//   styleUrls: ['./editmemo.component.css']
// })
// export class EditmemoComponent implements OnInit, OnDestroy {
//   @ViewChild('fileInput') fileInput!: ElementRef;
//   editor: Editor;
//   createEditForm: FormGroup;
//   isLoading = false;
//   editMemo: any;
//   step: any;
//   memoForm: FormGroup;
//   allowed_ips: string[] = [];
//   ip_address: string = ''; 
//   location: string | null = null;
//   ipAddress: string = '';
//   areaName:string = ''
//   locationDetails: any ={};
//   area_location: string[]=[];
//   template: any = [];
//   memId: string;
//   memo_attachments = [
//     {
//       name: "Sample",
//       size: "20",
//       type: "Images"
//     }
//   ];

//   constructor(private fb: FormBuilder, private httpRequest: HttpRequestService, private sidebarService: ServicesidebarService) {
//     this.editor = new Editor();
//     this.createEditForm = this.fb.group({
//       title: [''],
//       memo: [''],
//     });
//   }

//   // ngOnInit(): void {
//   //   this.editor = new Editor();
//   //   this.getMemo();
//   // }

//   ngOnDestroy(): void {
//     this.editor.destroy();
//   }


//   ngOnInit() {
//     this.editor = new Editor();
//     this.getMemo();
//     this.editMemo = this.sidebarService.getEditMemo();
//     console.log(this.editMemo);
    
//     // Populate the form with editMemo data
//     if (this.editMemo) {
//       this.createEditForm.patchValue({
//         title: this.editMemo.MemTitle,
//         memo: this.editMemo.MemContents,
//       });
//     }
//   }

//   onSubmit() {
//     this.isLoading=true;
//     // Create the memo object using form values
//     const memo = {
//       title: this.createEditForm.value.title,
//       memo: this.createEditForm.value.memo,
//       memId: this.editMemo.MemUniqueId,
//       memFold: this.editMemo.MemFoldId || null,
//     };

//     console.log(memo); // Log the memo object to check its structure

//     // Make the PATCH request
//     this.httpRequest.makePatchRequest('/memo/update', memo).subscribe(
//       (response) => {
//         console.log(response); 
//         this.createEditForm.reset();
//         this.isLoading= false; 
//       },
//       (error) => {
//         console.error('Error updating memo:', error);
//         this.isLoading= false
//       }
//     );
//   }













//   // DRAFT / CREATE MEMO
//   draftMemo(): void {
//     if (this.memoForm.valid) {
//       const memoData = this.memoForm.value;
//       console.log(memoData);
//       this.httpRequest.makePostRequest('/memo/create', memoData).subscribe(
//         (response: any) => {
//           console.log(response);
//           this.memId = response.id
//           // console.log(this.memId);
//           Toastify({
//             text: "success",
//             duration: 3000,
//             gravity: "top", 
//             position: "right", 
//             backgroundColor: "green",
//           }).showToast();
//         },
        
//         (error) => {
//           console.error('Error saving draft:', error);
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
//         gravity: "top", // `top` or `bottom`
//         position: "right", // `left`, `center` or `right`
//         backgroundColor: "red",
//       }).showToast();
//     }
//   }

//   onsubmit() {
//     const formValues = { ...this.memoForm.value, ipData: this.allowed_ips, geolocationData:Object.values(this.locationDetails), memId: this.memId, new: this.area_location};
//     console.log('Form Values:', formValues);
//     // this.createMemo(formValues); 
//     this.httpRequest.makePostRequest('/memo/mem_secure_rule/create', formValues).subscribe((response)=>{
//       console.log(response);
//       Toastify({
//         text: 'success',
//         duration: 3000,
//         gravity: "top", 
//         position: "right", 
//         backgroundColor: "green",
//       }).showToast();
//     }, (error)=>{
//       Toastify({
//         text: `${error}`,
//         duration: 3000,
//         gravity: "top", 
//         position: "right", 
//         backgroundColor: "red",
//       }).showToast();
//     })
//   }

//   onCheckboxChange(event: any) {
//     // Logic to handle checkbox change if needed
// }

// // FOR AREA 
//  fetchAreaDetails() {
//     this.areaName = this.memoForm.get('areaName')?.value;
    
//     this.area_location.push(this.areaName);
//     console.log('Area Name:', this.areaName);
//     if (this.areaName) {
//       this.httpRequest.fetchAreaDetails(this.areaName)
//         .subscribe(
//           (data: any) => {
//             // console.log(data);
//             if (data.results && data.results.length > 0) {
//               const result = data.results[0].annotations.DMS; // Get the first result
//               Toastify({
//                 text: 'success',
//                 duration: 3000,
//                 gravity: "top", 
//                 position: "right", 
//                 backgroundColor: "green",
//               }).showToast();
//               this.locationDetails[this.areaName] = {
//                 latitude: result.lat,
//                 longitude: result.lng,
//               };
//             } else {
//               Toastify({
//                 text: 'No location fetch for this area',
//                 duration: 3000,
//                 gravity: "top", 
//                 position: "right", 
//                 backgroundColor: "red",
//               }).showToast();
//             }
//           },
//           error => {
//             console.error(error);
//             Toastify({
//               text: `${error}`,
//               duration: 3000,
//               gravity: "top", 
//               position: "right", 
//               backgroundColor: "red",
//             }).showToast();
//           }
//         );
//     } else {
//       this.locationDetails = null; // Reset if no area name is provided
//     }
//   }



//   // CREATING ACCESS MEMMO
//   createMemo(values: any) {
//     // console.log(values);
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
//       access: values.access,
//       memId: this.memId,
//       users: [
//         {
//           phone: values.phone,
//           email: values.email,
//         },
//       ],
//     };
//     // console.log(memoData);
//     this.httpRequest.makePostRequest('/memo/access_type/create', memoData).subscribe(
//       (response) => {
//         console.log(response);
//         Toastify({
//           text: 'success',
//           duration: 3000,
//           gravity: "top", 
//           position: "right", 
//           backgroundColor: "red",
//         }).showToast();
//       },
//       (error) => {
//         console.log(error);
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



//   getMemo() {
//     // Implement your logic to fetch memo data
//     this.httpRequest.makeGetRequest('/memo/single?id=y89356548697887').subscribe((response)=>{
//       // console.log(response);
//     }, (error)=>{
//       console.log(error);
      
//     })
//   }

//   getMemoAttachments() {
//     // Implement your logic to fetch memo attachments
//     this.httpRequest.makeGetRequest(`/memo/memo_attachment?${this.memId}`).subscribe((response)=>{
//       console.log(response);
//     }, (error)=>{
//       console.log(error);
      
//     })
//   }

//   deleteAttachment(id: number) {
//     if (confirm('Are you sure you want to delete this attachment?')) {
//       this.httpRequest.makeDeleteRequest(`/memo/memo_attachment?id=${this.memId}`).subscribe(
//         (response) => {
//           console.log('Attachment deleted successfully', response);
//           this.getMemoAttachments();
//         },
//         (error) => {
//           console.error('Error deleting attachment', error);
//         }
//       );
//     }
//   }
  
//         // uploadLogo.append('memId', this.memId);
// // FILE ATTACHMENT 
// // Create Attachment
//   chooseFile() {
//     this.fileInput.nativeElement.click();
//   }
//   fileChangeEvent(event: any): void {
//     const uploadLogo = new FormData();
//     const image = event.target.files[0];
    
//     if (image) {
//       console.log(image);
//       uploadLogo.append('image', image, image.name);
//       this.httpRequest.makePostRequest('/memo/upload_image', uploadLogo,true).subscribe(
//         (response) => {
//           console.log(response);
//         },
//         (error) => {
//           console.log(error);
//         }
//       );
//     }
//     else {
//       console.warn('No file selected.');
//     }
//   }


//     // Implement your logic to handle security type changes
//     changeSecurityType(): void {
//       const selectedValue = (event.target as HTMLSelectElement).value;
//       if (selectedValue === 'template') {
//         this.saveTemplate();
//       }
//     }
  
//     saveTemplate(){
//       this.httpRequest.makeGetRequest('/memo/mem_secure_rule/all').subscribe((response)=>{
//         console.log(response.data);
//         this.template = response.data
//       // console.log(this.template);
//       })
//     }
  


//   // SELECT ACCESS TYPE. SHARING PAGE
//   selectFile() {
//     this.fileInput.nativeElement.click();
//   }
//   handleChangeEvent(event: any): void {
//     const uploadLogo = new FormData();
//     const image = event.target.files[0];
    
//     if (image) {
//       console.log(image);
//       uploadLogo.append('image', image, image.name);
//       this.httpRequest.makePostRequest('/memo/access_type/create', uploadLogo,true).subscribe(
//         (response) => {
//           console.log(response);
//         },
//         (error) => {
//           console.log(error);
//         }
//       );
//     }
//     else {
//       console.warn('No file selected.');
//     }
//   }

// }
