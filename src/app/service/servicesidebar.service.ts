import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicesidebarService {
  // Existing variable for the first implementation
  show: any = "undefined";

  // Object to track the visibility of different components
  private componentStates: { [key: string]: boolean } = {};

  constructor() { }

  // Existing method to show or hide the sidebar
  public showMother(data: string): void {
    this.show = data;
  }

  // New method to show or hide a specific component
 
}
