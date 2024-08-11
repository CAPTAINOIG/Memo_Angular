import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalstorageService } from '../LocalstorageService/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  
  
  constructor(
    private http: HttpClient,
    private localstorage:LocalstorageService,
  ) { }
  private baseUrl = 'https://8845-102-89-46-223.ngrok-free.app/api'; 
   headers = new HttpHeaders({
   "ngrok-skip-browser-warning" : '69420',
   'Content-Type': 'application/json',
   'Authorization': `Bearer ${this.localstorage.read("auth-token")?.token}`, 
 });
  public makeGetRequest(url:string,body:any={}){
    return this.http.get<any>(`${this.baseUrl}${url}`,{ headers:this.headers })
  }
  public makePostRequest(url:string,body:any={}){
    console.log(this.localstorage.read("auth-token")?.token)
    return this.http.post<any>(`${this.baseUrl}${url}`,{...body},{ headers:this.headers })
  }
}
