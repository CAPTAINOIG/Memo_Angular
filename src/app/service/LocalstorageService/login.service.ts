import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; 
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {
  
  currentUser:any;
  //noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };

  constructor(public storageService: LocalstorageService,private http: HttpClient) {
    this.currentUser = this.storageService.read<any>('currentUser');
  }
   
  login(data:any){
    return this.http.post('https://35a2-102-88-68-180.ngrok-free.app/api/auth/login', data);
  }
  
  
}