import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-security-check',
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './security-check.component.html',
    styleUrl: './security-check.component.css'
})
export class SecurityCheckComponent implements OnInit {
  isLoading = true;
  showPhoneOtpInput = false;
  showEmailOtpInput = false;
  showOtpVerification = false;
  phoneNumber = '';
  email = '';
  otp = '';
  message = '';
  latitude: number | undefined;
  longitude: number | undefined;
  errorMessage: string | undefined;


  constructor(private httpRequest: HttpRequestService) { }

  ngOnInit() {
    this.performSecurityChecks();
    this.getUserLocation();
  }

  performSecurityChecks() {
    this.checkIpSecurity().subscribe((ipCheckPassed) => {
      if (!ipCheckPassed) {
        this.message = 'Access denied: IP address not allowed.';
        this.isLoading = false;
        return;
      }

      this.checkLocationSecurity().then((locationCheckPassed) => {
        if (!locationCheckPassed) {
          this.message = 'Access denied: Location not allowed.';
          this.isLoading = false;
          return;
        }

        this.checkOtpSecurity();
      });
    });
  }

  checkIpSecurity() {
    return this.httpRequest.makeGetRequest('/api/check-ip-security');
  }

  checkLocationSecurity(): Promise<boolean> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          this.httpRequest.makePostRequest('/api/check-location-security', coords).subscribe(resolve);
        }, () => resolve(false));
      } else {
        resolve(false);
      }
    });
  }

  checkOtpSecurity() {
    this.httpRequest.makeGetRequest('/api/check-otp-security').subscribe((response) => {
      console.log(response);
    });
  }

  sendSmsOtp() {
    this.httpRequest.makePostRequest('/api/send-sms-otp', { phone: this.phoneNumber }).subscribe((response) => {
      this.showPhoneOtpInput = false;
      this.showOtpVerification = true;
    });
  }

  sendEmailOtp() {
    this.httpRequest.makePostRequest('/api/send-email-otp', { email: this.email }).subscribe((response) => {
      this.showEmailOtpInput = false;
      this.showOtpVerification = true;
    });
  }

  verifyOtp() {
    this.httpRequest.makePostRequest('/api/verify-otp', { otp: this.otp }).subscribe((isValid) => {
      if (isValid) {
        this.message = 'Access granted: OTP verified successfully.';
      } else {
        this.message = 'Access denied: Invalid OTP.';
      }
      this.isLoading = false;
    });
  }

  getUserLocation() {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage = 'User denied the request for Geolocation.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              this.errorMessage = 'The request to get user location timed out.';
              break;
          }
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
    }
  }
}
