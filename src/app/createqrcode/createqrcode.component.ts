import { Component, DoCheck, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpRequestService } from '../service/HttpRequest/http-request.service';
import { FormsModule } from '@angular/forms'; 
import Toastify from 'toastify-js';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../service/servicesidebar.service';

@Component({
  selector: 'app-createqrcode',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './createqrcode.component.html',
  styleUrl: './createqrcode.component.css'
})
export class CreateqrcodeComponent implements OnInit,  OnDestroy{
 
  qrCodeCheckInterval:any
  isLoading=false;


  constructor(private httpRequest:HttpRequestService, public handleModals:ServicesidebarService){

  }
  startQrCodeCheck() {
    this.qrCodeCheckInterval = setInterval(() => {
      this.fetchQrCode();
    }, 1000); 
  }

  ngOnDestroy(): void {
      clearInterval(this.qrCodeCheckInterval)
  }
  ngOnInit(): void {
    this.startQrCodeCheck()
  }
  
  fetchQrCode(){
    if(this.handleModals.createMemoTab && ['edit_files','create_memo'].includes(this.handleModals.show)){
      this.httpRequest.makeGetRequest('/memo/get_by_memuniqueid_that_is_not_used').subscribe((response)=>{
        // console.log(response.data.MemQRCode);
        if(response.data){
          this.handleModals.setQrCodeData(response.data)
        }
      }, (error)=>{
        // console.log(error);
      })

    }
  }
  createQrCode() {
    if (!this.handleModals.memId) {
      Toastify({
        text: "please create a memo",
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
        memId:this.handleModals.memId,
        memqrcodeId:this.handleModals.qrCodeData.MemUniqueId
      })
      this.httpRequest.makePatchRequest('/memo/update_memo_memuniqueid', updateMemoMemUniqueId).subscribe((response)=>{
        console.log(response);
        this.handleModals.qrCodeData = undefined;
        Toastify({
          text: "success",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "blue",
        }).showToast();
        this.isLoading = false;
      }, (error)=>{
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
