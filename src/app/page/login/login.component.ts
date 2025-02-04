import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpRequestService } from '../../service/HttpRequest/http-request.service';
import { LocalstorageService } from '../../service/LocalstorageService/localstorage.service';
import Toastify from 'toastify-js';
import { ServicesidebarService } from '../../service/servicesidebar.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  mac_address: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.mac_address = params['mac'];
      // console.log(this.macAddress)
      if (!this.mac_address) {
        Toastify({
          text: 'You are not allowed to view this page',
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "red",
        }).showToast();
        // this.router.navigate(['/errorpage']);
        setTimeout(() => {
          this.router.navigate(['/errorpage']);
        }, 2000);
      }
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private local: LocalstorageService,
    private HttpRequest: HttpRequestService,
    private userDetail: ServicesidebarService,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      identity: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const json = {
        ...this.loginForm.value,
        mac_address: this.mac_address,
      };
      // const json = this.loginForm.value;
      // console.log(json)
      this.HttpRequest.makePostRequest(`/auth/login`, json).subscribe({
        next: (data: any) => {
          // console.log(data)
          this.userDetail.setUserDetail(data)
          this.isLoading = false;
          if (data.status) {
            Toastify({
              text: `${data.message}`,
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "green",
            }).showToast();
            this.local.write("data", (data.token))
            this.local.write("isAdmin", (data.isAdmin))
            this.router.navigate(['/auth']);
          }
          // TO BE USED LATER
          // else{
          //   Toastify({
          //     text: `${data.message}`,
          // text: data.message || 'Invalid MAC address or credentials.',
          //     duration: 3000,
          //     gravity: "top",
          //     position: "right",
          //     backgroundColor: "red",
          //   }).showToast();
          // }
        },
        error: (err: any) => {
          this.isLoading = false;
          if (err?.status === 0) {
            Toastify({
              text: 'Something went wrong, please try again later',
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
            return;
          }
          if (err?.status === 404) {
            Toastify({
              text: 'Something went wrong, please try again later',
              duration: 3000,
              gravity: "top",
              position: "right",
              backgroundColor: "red",
            }).showToast();
            return;
          }
          const errMsg = err?.error?.message ?? err.message;
          Toastify({
            text: errMsg,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "red",
          }).showToast();
        }
      });
    }
  }
}