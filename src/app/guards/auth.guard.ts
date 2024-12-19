import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../service/LocalstorageService/localstorage.service';


export const authGuard: CanActivateFn = (route, state) => {
  let routes = inject (Router)
  const localStorageService  = inject(LocalstorageService)
  // let user = JSON.parse(localStorage.getItem('auth-token')!)
  let user = localStorageService.read('data')

  console.log(user)
  if(!user){
    routes.navigate(['login'])
  }
  return true;
};

