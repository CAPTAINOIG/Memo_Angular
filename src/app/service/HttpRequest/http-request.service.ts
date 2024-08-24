import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalstorageService } from '../LocalstorageService/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  
  private baseUrl = 'https://8af3-102-89-23-122.ngrok-free.app/api'; 
  private geoApiKey = '39f835849b07490f9ada6d2e31447933';
  
  constructor(
    private http: HttpClient,
    private localstorage: LocalstorageService,
  ) { }

  public makeGetRequest(url: string, body: any = {}) {
    return this.http.get<any>(`${this.baseUrl}${url}`, { headers: this.returnHeader() });
  }

  public makePostRequest(url: string, body: any = {}, isMultipart: boolean = false) {
    const headers = isMultipart ? undefined : this.returnHeader(); // Skip headers if multipart
    return this.http.post<any>(`${this.baseUrl}${url}`, body, { headers });
  }

  public makePatchRequest(url: string, body: any = {}) {
    return this.http.patch<any>(`${this.baseUrl}${url}`, body, { headers: this.returnHeader() });
  }

  makeDeleteRequest(url: string, body: any = {}) {
    return this.http.delete<any>(`${this.baseUrl}${url}`, { headers: this.returnHeader() });
  }

   // New method for fetching IP location
   public fetchLocation(ipAddress: string) {
    return this.http.get<any>(`https://ipapi.co/${ipAddress}/json/`);
  }
  public fetchAreaDetails(areaName: string) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(areaName)}&key=${this.geoApiKey}`;
    return this.http.get<any>(url);
  }
  private returnHeader() {
    return new HttpHeaders({
      "ngrok-skip-browser-warning": '69420',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.localstorage.read("data")}`,
    });
  }
}
