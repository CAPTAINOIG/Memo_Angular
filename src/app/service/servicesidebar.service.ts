import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesidebarService {
  // Existing variable for the first implementation
  show: any = "undefined";
  check="nothing";
  public userData: any;
  public authData: any;
  public UserDetail: any;
  public editMemo: any;
  public publishMemId:any;
  public memId:any
  createMemoTab=undefined
  qrCodeData=undefined;


  // Object to track the visibility of different components
  private componentStates: { [key: string]: boolean } = {};

  constructor() { }

  // Existing method to show or hide the sidebar


  setQrCodeData(data:any){
    this.qrCodeData=data

  }
  
  public showMother(data: string): void {

    
    this.show = data;
  }
  public toggleCheck(data): void {
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

  setPublishMemId=(data)=>this.publishMemId=data
  setEditMemo(data:any){
    console.log(data)
    this.editMemo = data
  }





  getEditMemo(){
    return this.editMemo
  }
 
}
