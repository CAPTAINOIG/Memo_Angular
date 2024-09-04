// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { LocalstorageService } from '../LocalstorageService/localstorage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpRequestService {
  
//   constructor(
//     private http: HttpClient,
//     private localstorage: LocalstorageService,
//   ) { }
  
//   private baseUrl = 'https://3463-102-88-36-150.ngrok-free.app/api'; 

//   public makeGetRequest(url: string, body: any = {}) {
//     return this.http.get<any>(`${this.baseUrl}${url}`, { headers: this.returnHeader() });
//   }

//   public makePostRequest(url: string, body: any = {}, isMultiPart: boolean = false) {
//     if (isMultiPart) {
//       const formData = new FormData();
//       // Assuming body contains an image file and other fields
//       if (body.image) {
//         formData.append('image', body.image); // Append the image
//       }
//       // Append other fields if needed
//       for (const key in body) {
//         if (key !== 'image') {
//           formData.append(key, body[key]);
//         }
//       }
//       return this.http.post<any>(`${this.baseUrl}${url}`, formData);
//     } else {
//       return this.http.post<any>(`${this.baseUrl}${url}`, body, { headers: this.returnHeader() });
//     }
//   }

//   public makePatchRequest(url: string, body: any = {}) {
//     return this.http.patch<any>(`${this.baseUrl}${url}`, { ...body }, { headers: this.returnHeader() });
//   }

//   public returnHeader = () => new HttpHeaders({
//     "ngrok-skip-browser-warning": '69420',
//     'Authorization': `Bearer ${this.localstorage.read("data")}`, 
//   });
// }
