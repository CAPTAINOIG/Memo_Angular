// {/* <div class="sidebar-content">
//   <form [formGroup]="createEditForm" (ngSubmit)="onSubmit()">
//       <div class="form-group">
//           <label for="title">Title</label>
//           <input type="text" formControlName="title" class="form-control" id="title" placeholder="">
//       </div>
      
//       <div class="form-group">
//           <label for="memo">Memo</label>
//           <div class="NgxEditor__Wrapper">
//               <ngx-editor-menu [editor]="editor"></ngx-editor-menu>
//               <ngx-editor
//                   [editor]="editor"
//                   formControlName="memo"
//                   [disabled]="false"
//                   [placeholder]="'Type here...'"
//               ></ngx-editor>
//           </div>
//       </div>
      
//       <div class="form-group form-check">
//           <input type="checkbox" formControlName="include_signature" class="form-check-input" id="include_signature">
//           <label class="form-check-label" for="include_signature">Include Signature</label>
//       </div>
      
//       <button type="submit" class="btn btn-primary">Save Draft</button>
//   </form>
// </div> */}



// <div class="sidebar-content">
//     <ul class="nav nav-tabs mb-3" role="tablist">
//         <li class="nav-item">
//             <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Content</a>
//         </li>
//         <li class="nav-item">
//             <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Attachments</a>
//         </li>
//         <li class="nav-item">
//             <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Security</a>
//         </li>
//         <li class="nav-item">
//             <a class="nav-link" id="sharing-tab" data-toggle="tab" href="#sharing" role="tab" aria-controls="sharing" aria-selected="false">Sharing</a>
//         </li>
//     </ul>

//     <div class="tab-content">
//         <!-- Content Tab -->
//         <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
//             <form [formGroup]="createEditForm" (ngSubmit)="onSubmit()">
//                 <div class="form-group">
//                     <label for="title">Title</label>
//                     <input type="text" formControlName="title" class="form-control" id="title" placeholder="">
//                 </div>

//                 <!-- <div class="form-group">
//                     <label for="memo">Memo</label>
//                     <div class="NgxEditor__Wrapper">
//                         <ngx-editor
//                             [editor]="editor"
//                             formControlName="memo"
//                             [disabled]="false"
//                             [placeholder]="'Type here...'"
//                         ></ngx-editor>
//                     </div>
//                 </div> -->

//                 <div class="form-group">
//                     <label for="memo">Memo</label>
//                     <div class="NgxEditor__Wrapper">
//                         <ngx-editor-menu [editor]="editor"></ngx-editor-menu>
//                         <ngx-editor
//                             [editor]="editor"
//                             formControlName="memo"
//                             [disabled]="false"
//                             [placeholder]="'Type here...'"
//                         ></ngx-editor>
//                     </div>
//                 </div>

//                 <button [disabled]="isLoading" type="submit" class="btn btn-primary">
//                     <span *ngIf="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                     Save Draft
//                 </button>

//                 <div *ngIf="isLoading" class="loading-message">
//                     Saving... Please wait.
//                 </div>
//             </form>
//         </div>

//         <!-- Attachments Tab -->
//         <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
//             <p *ngIf="memo_attachments.length === 0">No attachments</p>
//             <button (click)="chooseFile()" class="btn btn-lg btn-block btn-outline-primary">
//                 <i class="fa fa-cloud-upload mr-3"></i> Upload Attachment
//             </button>
//             <input type="file" id="input-file" name="input-file" #fileInput (change)="fileChangeEvent($event)" hidden>
//             <div *ngIf="memo_attachments.length > 0">
//                 <div class="list-group list-group-flush mb-3">
//                     <a *ngFor="let attach of memo_attachments" href="javascript:;" class="list-group-item px-0 d-flex align-items-center">
//                         <div class="mr-3">
//                             <figure class="avatar">
//                                 <span class="avatar-title bg-primary-bright text-primary rounded">
//                                     <i class="ti-image"></i>
//                                 </span>
//                             </figure>
//                         </div>
//                         <div class="flex-grow-1">
//                             <p class="mb-0">{{attach.name}}</p>
//                             <span class="small text-muted">{{attach.type}}</span>
//                         </div>
//                         <div>
//                             <h5 class="text-primary">{{attach.size}}</h5>
//                         </div>
//                         <div>
//                             <a href="javascript:;" class="btn btn-floating" (click)="deleteAttachment(1)">
//                                 <i class="ti-trash"></i>
//                             </a>
//                         </div>
//                     </a>
//                 </div>
//             </div>
//         </div>

//         <!-- Security Tab -->
//         <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
//             <form [formGroup]="memoForm" (ngSubmit)="onsubmit()">
//                 <div class="form-group">
//                     <label for="security_type">Security Types</label>
//                     <select (change)="changeSecurityType()" name="security_type" formControlName="security_type" class="form-control" id="security_type">
//                         <option></option>
//                         <option value="template">Select from Templates</option>
//                         <option value="custom">Create Custom</option>
//                     </select>
//                 </div>

//                 <div *ngIf="memoForm.controls['security_type'].value === 'custom'">
//                     <h6 class="d-md-flex justify-content-between mb-3">
//                         <span class="d-block">Create custom security features</span>
//                     </h6>
//                     <!-- Email OTP -->
//                     <div class="card card-body mb-3 d-flex justify-content-between flex-row">
//                         <div>
//                             <a href="#"><i class="fa fa-lock mr-2"></i> Email OTP</a>
//                         </div>
//                         <div>
//                             <div class="form-group form-check">
//                                 <input type="checkbox" formControlName="secureByEmailOtp" class="form-check-input" id="emailOtpCheck">
//                             </div>
//                         </div>
//                     </div>
//                     <!-- SMS OTP -->
//                     <div class="card card-body mb-3 d-flex justify-content-between flex-row">
//                         <div>
//                             <a href="#"><i class="fa fa-lock mr-2"></i> SMS OTP</a>
//                         </div>
//                         <div>
//                             <div class="form-group form-check">
//                                 <input type="checkbox" formControlName="secureBySmsOtp" class="form-check-input" id="smsOtpCheck">
//                             </div>
//                         </div>
//                     </div>
//                     <!-- IP Address -->
//                     <div class="card card-body mb-3 d-flex justify-content-between flex-row">
//                         <div>
//                             <a href="#"><i class="fa fa-lock mr-2"></i> IP Address</a>
//                         </div>
//                         <div>
//                             <div class="form-group form-check">
//                                 <input type="checkbox" formControlName="secureByIp" class="form-check-input" id="ipCheck">
//                             </div>
//                         </div>
//                     </div>
//                     <!-- IP Address Input -->
//                     <div class="card" *ngIf="memoForm.controls['secureByIp'].value">
//                         <div class="card-body">
//                             <div class="form-inline">
//                                 <div class="form-group mb-2">
//                                     <label for="ip_address" class="sr-only">Enter IP Address</label>
//                                     <input type="text" class="border border-dark rounded form-control-plaintext" id="ip_address" name="ip_address" formControlName="ip_address" placeholder="Enter IP Address">
//                                 </div>
//                                 <button (click)="addIP(memoForm.controls['ip_address'].value)" type="button" class="btn btn-primary mb-2">Add IP Address</button>
//                             </div>
//                             <ul class="list-inline">
//                                 <li class="list-inline-item" *ngFor="let ip of allowed_ips">
//                                     <span class="badge border bg-success-bright text-success">{{ip}}</span>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     <!-- Location Geofencing -->
//                     <div class="card card-body mb-3 d-flex justify-content-between flex-row">
//                         <div>
//                             <a href="#"><i class="fa fa-lock mr-2"></i> Location Geofencing</a>
//                         </div>
//                         <div>
//                             <div class="form-group form-check">
//                                 <input type="checkbox" formControlName="secureByGeoLocation" class="form-check-input" id="geoLocationCheck" (change)="onCheckboxChange($event)">
//                             </div>
//                         </div>
//                     </div>
//                     <div class="card" *ngIf="memoForm.controls['secureByGeoLocation'].value">
//                         <input type="text" formControlName="areaName" placeholder="Enter Area Name" class="form-control">
//                         <button class="btn btn-primary mb-2" type="button" (click)="fetchAreaDetails()">Get Location Details</button>
//                         <div *ngIf="!locationDetails && memoForm.get('areaName')?.value">No location found for this area.</div>
//                         <li class="list-inline-item" *ngFor="let loc of area_location">
//                             <span class="badge border bg-success-bright text-success">{{loc}}</span>
//                         </li>
//                     </div>
//                     <!-- Create as Template -->
//                     <div class="form-group form-check">
//                         <input type="checkbox" formControlName="create_as_template" class="form-check-input" id="create_as_template">
//                         <label class="form-check-label" for="create_as_template">Create as template</label>
//                     </div>
//                     <!-- Template Input -->
//                     <div class="card" *ngIf="memoForm.controls['create_as_template'].value">
//                         <div class="card-body">
//                             <div class="form-group" *ngFor="let item of template">
//                                 <p>Id: {{ item.Id }}</p>
//                                 <p>CreatedAt: {{ item.CreatedAt }}</p>
//                                 <p>MemSecByIp: {{ item.MemSecByIp }}</p>
//                                 <p>MemSecBySmsOTP: {{ item.MemSecBySmsOTP }}</p>
//                                 <p>MemSecByEmailOTP: {{ item.MemSecByEmailOTP }}</p>
//                             </div>
//                             <div>
//                                 <label for="">New Template Name</label>
//                                 <input type="text" formControlName="templateName" id="templateName" class="form-control" placeholder="Enter Template Name">
//                             </div>
//                             <div class="form-group">
//                                 <label for="templateDescription">Template Description</label>
//                                 <textarea formControlName="templateDescription" id="templateDescription" class="form-control" placeholder="Enter Template Description"></textarea>
//                             </div>
//                             <button type="button" class="btn btn-primary">Save Template</button>
//                         </div>
//                     </div>
//                 </div>
//                 <button type="submit" class="btn btn-primary">Save</button>
//             </form>
//         </div>

//         <!-- Sharing Tab (Placeholder) -->
//         <div class="tab-pane fade" id="sharing" role="tabpanel" aria-labelledby="sharing-tab">
//             <form [formGroup]="memoForm" (ngSubmit)="createMemo(memoForm.value)">
//                 <div class="form-group">
//                     <label for="access">Select Access Type</label>
//                     <select name="access" formControlName="access" class="form-control" id="access">
//                         <option></option>
//                         <option value="public">Public</option>
//                         <option value="restricted">Restricted</option>
//                     </select>
//                 </div>
//                 <div *ngIf="memoForm.controls['access'].value === 'restricted'" style="margin: 16px 0px;">
//                     <button (click)="selectFile()" class="btn btn-lg btn-block btn-outline-primary"><i class="fa fa-cloud-upload mr-3"></i> Upload Allowed Users</button>
//                     <input type="file" id="input-file" name="input-file" #fileInput (change)="handleChangeEvent($event)" hidden>

//                     <div class="card border-0" style="margin: 16px 0px;">
//                         <div class="form-group">
//                             <label for="users_name">Name</label>
//                             <input type="text" formControlName="name" class="form-control" id="users_name" placeholder="Enter name">
//                         </div>

//                         <div class="form-group">
//                             <label for="users_email">Email</label>
//                             <input type="email" formControlName="email" class="form-control" id="users_email" placeholder="Enter email">
//                         </div>

//                         <div class="form-group">
//                             <label for="phone">Phone</label>
//                             <input type="text" formControlName="phone" class="form-control" id="users_phone" placeholder="Enter phone number">
//                         </div>
//                     </div>
//                 </div>

//                 <button type="submit" class="btn btn-primary">Save</button>
//             </form>
//         </div>
//     </div>
// </div>
