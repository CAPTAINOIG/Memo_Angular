import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }
  write(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }

  read<T>(key: string): any {
    let value: string = localStorage.getItem(key);

    if (value && value != "undefined" && value != "null") {
      return <T>JSON.parse(value);
    }
    return undefined

    return null;
  }
  readArray<T>(key: string): any {
    let value: any = localStorage.getItem(key);

    if (value && value != "undefined" && value != "null") {
      return value;
    }

    return null;
  }
}





// @Injectable({
//   providedIn: 'root',
// })
// export class LocalStorageService {
// constructor(){ }
//   read(key: string): any {
//     const value = localStorage.getItem(key);
//     return value ? JSON.parse(value) : null; // Handle null case
//   }

//   write(key: string, value: any): void {
//     localStorage.setItem(key, JSON.stringify(value));
//   }

//   remove(key: string): void {
//     localStorage.removeItem(key);
//   }
// }

