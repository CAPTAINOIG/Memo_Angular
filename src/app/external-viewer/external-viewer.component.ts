import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../service/HttpRequest/http-request.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Toastify from 'toastify-js';

@Component({
    selector: 'app-external-viewer',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './external-viewer.component.html',
    styleUrls: ['./external-viewer.component.css']
})
export class ExternalViewerComponent implements OnInit {
  itemId: string | null = null;
  status: string = "isLoading";
  message: string = "";
  data: any = undefined;
  isLoader = false;

  identity: string = '';
  identityOtp: string = '';
  identityOtpSent: boolean = false;
  isVerified: boolean = false;


  constructor(private http: HttpRequestService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      this.getData();
    });
  }


  getData(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        if (!latitude || !longitude) {
          this.status = 'error';
          this.message = "Unable to retrieve your location coordinates.";

          return;
        }
        this.status = "isLoading";

        this.http.makeGetRequest(`/memo/get_mem_by_memuniqueid/?id=${this.itemId}&lat=${latitude}&long=${longitude}`)
          .subscribe(
            (response) => {

              if (response.data) {
                this.status = 'data';
                this.data = response.data;
                console.log(this.data);
              }
              else if (response.requireAccess) {
                this.status = 'requireAccess';
              }
              else {
                this.status = 'message';
                this.message = response.message
              }
            },
            (error) => {
              this.status = 'error';
              this.message = error.error.message;
              console.error(error);
            }
          );
      },
      (error: any) => {
        this.status = 'error';
        this.message = "This page requires your location to fetch the data";
        console.error('Error retrieving location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  sendIdentityOtp() {
    if (!this.identity) {
      console.log('empty');
      Toastify({
        text: 'input cannot be empty',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();
      return;
    }
    this.isLoader = true;
    const verifyIdentity = {
      identity: this.identity,
      memId: this.itemId
    }
    console.log(verifyIdentity);

    this.http.makePostRequest('/memo/verify_viewer_identity/', verifyIdentity).subscribe((response) => {
      console.log(response);
      this.status = "Next_token"
      Toastify({
        text: 'success',
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "blue",
      }).showToast();
      this.isLoader = false;
    }, (error) => {
      this.isLoader = false;
      this.message = error.error.message;
      Toastify({
        text: `${error.error.message};`,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "red",
      }).showToast();

    })
  }

}
