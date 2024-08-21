import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesidebarService {
  // Existing variable for the first implementation
  show: any = "undefined";
  public userData: any;
  public authData: any;
  public UserDetail: any;
  public editMemo: any;

  // Object to track the visibility of different components
  private componentStates: { [key: string]: boolean } = {};

  constructor() { }

  // Existing method to show or hide the sidebar
  public showMother(data: string): void {
    this.show = data;
  }

  setUserData(data: any) {
    this.userData = data;
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

  setEditMemo(data:any){
    this.editMemo = data
  }

  getEditMemo(){
    return this.editMemo
  }
 
}
