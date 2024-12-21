import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../service/LocalstorageService/localstorage.service';


export const authGuard: CanActivateFn = (route, state) => {
  let routes = inject (Router)
  const localStorageService  = inject(LocalstorageService)
  let user = localStorageService.read('data')
  if(!user){
    routes.navigate(['/login'])
  }
  return true;
};

export const isAdminGaurd: CanActivateFn = (route, state) => {
  let routes = inject (Router)
  const localStorageService  = inject(LocalstorageService)
  let user = localStorageService.read('isAdmin')
  if(!user){
    routes.navigate(['/portal/dashboard'])
  }
  return true;
};

