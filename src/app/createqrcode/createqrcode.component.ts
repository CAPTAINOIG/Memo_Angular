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
  // public item:any=undefined;
 
  qrCodeCheckInterval:any
  isLoading=false;


  constructor(private httpRequest:HttpRequestService, public handleModals:ServicesidebarService){
  

  }
  startQrCodeCheck() {
    // Use setInterval to call fetchQrCode every second
    this.qrCodeCheckInterval = setInterval(() => {
      this.fetchQrCode();
    }, 1000); // 1000 ms = 1 second
  }

  ngOnDestroy(): void {
      clearInterval(this.qrCodeCheckInterval)
  }
  ngOnInit(): void {
    this.startQrCodeCheck()
  }
  // ngDoCheck(): void {
  //   if(this.handleModals.createMemoTab && ['edit_files','create_memo'].includes(this.handleModals.show)){
  //     // this.item=undefined
  //     // this.handleModals.setCreateMemoTabs(undefined)
    
  //   }
    
  // }

  
  fetchQrCode(){
    if(this.handleModals.createMemoTab && ['edit_files','create_memo'].includes(this.handleModals.show)){
      this.httpRequest.makeGetRequest('/memo/get_by_memuniqueid_that_is_not_used').subscribe((response)=>{
        if(response.data[0]){
          this.handleModals.setQrCodeData(response.data[0])
          // this.item = response.data[0];
          // this.qrInput=response?.data[0]?.MemUniqueId
        }
        // console.log(response.data)
        
      }, (error)=>{
        console.log(error);
        
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
      // console.log(updateMemoMemUniqueId);
      this.httpRequest.makePatchRequest('/memo/update_memo_memuniqueid', updateMemoMemUniqueId).subscribe((response)=>{
        console.log(response);
          // Clear the QR code data after a successful response
        this.handleModals.qrCodeData = undefined;
      //   this.handleModals.qrCodeData.MemUniqueId = '';
      // this.handleModals.qrCodeData.MemQrCode = '';
        // console.log(this.updateMemoMemUniqueId)
        Toastify({
          text: "success",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "green",
        }).showToast();
        this.isLoading = false;
      }, (error)=>{
        console.log(error)
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
