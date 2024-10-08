// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import {
//   HttpClient,
//   HttpClientModule,
//   provideHttpClient,
//   withInterceptors,
// } from '@angular/common/http';
// import { importProvidersFrom, isDevMode } from '@angular/core';
// import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
// import { provideServiceWorker } from '@angular/service-worker';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }), 
//     provideRouter(routes),
//     provideAnimations(),
//     importProvidersFrom(HttpClientModule),
//     importProvidersFrom(BrowserAnimationsModule), provideServiceWorker('ngsw-worker.js', {
//             enabled: !isDevMode(),
//             registrationStrategy: 'registerWhenStable:30000'
//           }), provideServiceWorker('ngsw-worker.js', {
//             enabled: !isDevMode(),
//             registrationStrategy: 'registerWhenStable:30000'
//           })
//   ]
// };


import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }), provideAnimationsAsync(),
    // Add other providers here if needed
  ]
};

