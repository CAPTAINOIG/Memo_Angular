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
