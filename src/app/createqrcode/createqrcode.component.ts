import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpRequestService } from '../service/HttpRequest/http-request.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Toastify from 'toastify-js';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../service/servicesidebar.service';

@Component({
  selector: 'app-createqrcode',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './createqrcode.component.html',
  styleUrl: './createqrcode.component.css'
})
export class CreateqrcodeComponent implements OnInit, OnDestroy {

  qrCodeCheckInterval: any
  isLoading = false;
  form: FormGroup;
  isQrCodeFetched = false;
  isQrCodeLoader = false;



  constructor(private httpRequest: HttpRequestService, public handleModals: ServicesidebarService, private qrCodeService: ServicesidebarService) {
      this.form = new FormGroup({
        qrcode: new FormControl(''),
      });
  }
  // startQrCodeCheck() {
  //   this.qrCodeCheckInterval = setInterval(() => {
  //     this.fetchQrCode();
  //   }, 1000);
  // }

  ngOnDestroy(): void {
    // clearInterval(this.qrCodeCheckInterval)
  }
  
  ngOnInit(): void {
    // this.fetchQrCode()
    const memId = this.handleModals.publishMemId
  }

  // fetchQrCode() {
  //   if (this.handleModals.createMemoTab && ['edit_files', 'create_memo'].includes(this.handleModals.show)) {
  //     this.httpRequest.makeGetRequest('/memo/get_by_memuniqueid_that_is_not_used').subscribe((response) => {
  //       if (response.data) {
  //         console.log(response.data);
  //         this.handleModals.setQrCodeData(response.data)
  //       }
  //     }, (error) => {
  //       console.log(error);
  //     })

  //   }
  // }
  
  handleQrCodeLink() {
    const qrCodeValue = this.form.controls['qrcode'].value;
    if (!qrCodeValue) {
      Toastify({
        text: "QR Code is required",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "orange",
      }).showToast();
      return;
    }
    this.isQrCodeLoader = true;
    this.httpRequest.makePatchRequest('/memo/update_memqrcode', {memQrcodeLink:qrCodeValue})
      .subscribe(
        (response) => {
          this.isQrCodeLoader = false;
          this.handleModals.setQrCodeData(response.data)
          this.form.reset();
          this.isQrCodeFetched = true;
          Toastify({
            text: "Success",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "blue",
          }).showToast();
        },
        (error) => {
          this.isQrCodeLoader = false;
          Toastify({
            text: `${error.error.message || 'An error occurred'}`,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
          }).showToast();
        }
      );
  }

  createQrCode() {
    // const memId = this.handleModals.show !== 'edit_files' ? this.handleModals.memId : this.handleModals?.editMemo?.MemUniqueId;
    const memId = this.handleModals.publishMemId.memId
    if (!memId) {
      Toastify({
        text: "memId is required",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      this.isLoading = false;
      return
    }
    this.isLoading = true;
    let updateMemoMemUniqueId = ({
      memId,
      memqrcodeId: this.handleModals.qrCodeData.MemUniqueId
    })
    this.httpRequest.makePatchRequest('/memo/update_memo_memuniqueid', updateMemoMemUniqueId).subscribe((response) => {
      Toastify({
        text: "success",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "blue",
      }).showToast();
      this.isLoading = false;
      this.qrCodeService.triggerQrCodeRefresh();
      this.handleModals.qrCodeData = undefined;
      this.handleModals.showMother("undefined")
    }, (error) => {
      this.isLoading = false;
      Toastify({
        text: "invalid",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
    })
  }


}
