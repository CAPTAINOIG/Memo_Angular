import { Component } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-otpconfirmation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './otpconfirmation.component.html',
  styleUrls: ['./otpconfirmation.component.css']
})
export class OtpconfirmationComponent {
  otp: string = '';
  isLoading = false;

  constructor(private httpRequest: HttpRequestService, public handleModal: ServicesidebarService) { }

  onSubmit() {
    if(!this.otp){
      Toastify({
        text: 'invalid',
        gravity: 'top',
        duration: 3000,
        backgroundColor: 'red',
        position: 'right',
      }).showToast();
      return;
    }
    this.isLoading = true;
    console.log(this.otp)
    this.httpRequest.makePostRequest('/auth/validate_two_fact_auth', { otp: this.otp }).subscribe(
      (response) => {
        if(response.status){
          this.publishAndUnpublish()
        }else{
          this.isLoading = false;
        }
      },
      (error) => {
        console.error('Error updating memo:', error);
        this.isLoading = false;
        Toastify({
          text: "invalid OTP",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
        return;
      }
    );
  }


  publishAndUnpublish() {
    this.httpRequest.makePatchRequest('/memo/publsh_memo', { "memId": this.handleModal.publishMemId.memId,'publish': this.handleModal.publishMemId.status }).subscribe((response) => {
      this.isLoading = false;
      this.handleModal.showMother("undefined")
      
    }, (error) => {
      console.log(error);
      this.isLoading = false

    })

  }
}
