import { Component } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
  selector: 'app-otpconfirmation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './otpconfirmation.component.html',
  styleUrls: ['./otpconfirmation.component.css'] // Renamed to 'styleUrls'
})
export class OtpconfirmationComponent {
  otp: string = '';
  isLoading = false;

  constructor(private httpRequest: HttpRequestService, public handleModal: ServicesidebarService) { }

  onSubmit() {
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
      }
    );
  }


  publishAndUnpublish() {
    this.httpRequest.makePatchRequest('/memo/publsh_memo', { "memId": this.handleModal.publishMemId }).subscribe((response) => {
      this.isLoading = false;
      this.handleModal.showMother("undefined")
      
    }, (error) => {
      console.log(error);
      this.isLoading = false

    })

  }
  // onSubmit(): void{
  //   this.isLoading = true
  //   if(this.createAuthForm.valid){
  //     const auth = this.createAuthForm.value
  //     // console.log(auth);
  //     this.httpRequest.makePostRequest('/users_management/verify_auth', auth).subscribe((response)=>{
  //       console.log(response);
  //       this.isLoading = false
  //     }, (error)=>{
  //       console.log(error);
  //       this.isLoading = false

  //     })
  // }
}
