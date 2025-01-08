import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesidebarService {
  show: any = "undefined";
  check="nothing";
  status = ['Save Draft','Pending', 'Approved', 'Rejected']
  public userData: any;
  public authData: any;
  public UserDetail: any;
  public editMemo: any;
  public publishMemId:any;
  public memId:any
  createMemoTab=undefined
  qrCodeData=undefined;


  private componentStates: { [key: string]: boolean } = {};

  constructor() { }

  private refreshFolderSubject = new BehaviorSubject<boolean>(true);
  refreshFolder$ = this.refreshFolderSubject.asObservable();

  triggerFolderRefresh() {
    this.refreshFolderSubject.next(true);
  };

  private refreshFileSubject = new BehaviorSubject<boolean>(true);
  refreshFile$ = this.refreshFileSubject.asObservable();

  triggerFileRefresh() {
    this.refreshFileSubject.next(true);
  };

  private refreshUserSubject = new BehaviorSubject<boolean>(true);
  refreshUser$ = this.refreshUserSubject.asObservable();

  triggerUserRefresh(){
    this.refreshUserSubject.next(true);
  }

  // we brought the data here because we want it to be cleared after every secs so we brought it to service
  setQrCodeData(data:any){
    this.qrCodeData=data
  }
  
  public showMother(data: string): void {

    
    this.show = data;
  }
  public toggleCheck(data:any): void {
    this.check = data;
  }

  setCreateMemoTabs(data:any){
    this.createMemoTab=data
    if(!data){
      this.setQrCodeData(undefined)
    }

  }
  setUserData(data: any) {
    this.userData = data;
  }

  setMemId(data:any){
    this.memId=data
  }

  getUserData(){
    return this.userData
  }

  setAuthData(data:any){
    this.authData = data
  }

  getAuthData(){
    return this.authData
  }

  setUserDetail(data:any){
    this.UserDetail = data
  }

  getUserDetail(){
    return this.UserDetail
  }

  setPublishMemId=(data:any)=>this.publishMemId=data
  setEditMemo(data:any){
    console.log(data)
    this.editMemo = data
  }

  getEditMemo(){
    return this.editMemo
  }
 
}
